import { Subject } from 'rxjs';
import {
  Doc,
  applyUpdate,
  encodeStateAsUpdate,
  encodeStateVector,
  mergeUpdates,
} from 'yjs';
import isEqual from 'deep-equal';
import { SyncPeerStep } from './consts';
import { SyncStorage } from './storage';
import {
  PriorityAsyncQueue,
  SharedPriorityTarget,
} from '../utils/shared-priority-target';
import { MANUALLY_STOP, throwIfAborted } from '../utils/throw-if-aborted';
import { ConsoleLogger, NoopLogger } from '../../logger';

export interface SyncPeerStatus {
  step: SyncPeerStep;
  totalDocs: number;
  loadedDocs: number;
  pendingPullUpdates: number;
  pendingPushUpdates: number;
}

export class SyncPeer {
  private _status: SyncPeerStatus = {
    step: SyncPeerStep.LoadingRootDoc,
    totalDocs: 1,
    loadedDocs: 0,
    pendingPullUpdates: 0,
    pendingPushUpdates: 0,
  };

  onStatusChange = new Subject<SyncPeerStatus>();

  logger = new NoopLogger('SyncPeer');

  readonly abort = new AbortController();

  get name() {
    return this.storage.name;
  }

  constructor(
    private readonly rootDoc: Doc,
    private readonly storage: SyncStorage,
    private readonly priorityTarget = new SharedPriorityTarget(),
  ) {
    this.logger.debug('peer start');

    this.syncRetryLoop(this.abort.signal).catch((err) => {
      // should not reach here
      console.error(err);
    });
  }

  private set status(s: SyncPeerStatus) {
    if (!isEqual(s, this._status)) {
      // this.logger.debug('status change', s);
      this._status = s;
      this.onStatusChange.next(s);
    }
  }

  get status() {
    return this._status;
  }

  /**
   * stop sync
   *
   * SyncPeer is one-time use, this peer should be discarded after call stop().
   */
  stop() {
    this.logger.debug('peer stop');
    this.abort.abort(MANUALLY_STOP);
  }

  /**
   * auto retry after 5 seconds if sync failed
   */
  async syncRetryLoop(abort: AbortSignal) {
    while (abort.aborted === false) {
      try {
        // eslint-disable-next-line no-await-in-loop
        await this.sync(abort);
      } catch (err) {
        if (err === MANUALLY_STOP || abort.aborted) {
          return;
        }

        this.logger.error('sync error', err);
      }
      try {
        this.logger.error('retry after 5 seconds');
        this.status = {
          step: SyncPeerStep.Retrying,
          totalDocs: 1,
          loadedDocs: 0,
          pendingPullUpdates: 0,
          pendingPushUpdates: 0,
        };
        // it fine!
        // eslint-disable-next-line no-await-in-loop
        await Promise.race([
          new Promise<void>((resolve) => {
            setTimeout(resolve, 5 * 1000);
          }),
          new Promise((_, reject) => {
            // exit if manually stopped
            if (abort.aborted) {
              reject(abort.reason);
            }
            abort.addEventListener('abort', () => {
              reject(abort.reason);
            });
          }),
        ]);
      } catch (err) {
        if (err === MANUALLY_STOP || abort.aborted) {
          return;
        }

        // should never reach here
        throw err;
      }
    }
  }

  // handle updates from storage
  handleStorageUpdates = (id: string, data: Uint8Array) => {
    this.state.pullUpdatesQueue.push({
      id,
      data,
    });
    this.reportSyncStatus();
  };

  /**
   * main synchronization logic
   */
  // eslint-disable-next-line class-methods-use-this
  async sync(abortOuter: AbortSignal) {
    this.initState();
    const abortInner = new AbortController();

    abortOuter.addEventListener('abort', (reason) => {
      abortInner.abort(reason);
    });

    let dispose: (() => void) | null = null;
    try {
      this.reportSyncStatus();

      // start listen storage updates
      dispose = await this.storage.subscribe(
        this.handleStorageUpdates,
        (reason) => {
          // abort if storage disconnect, should trigger retry loop
          abortInner.abort(`subscribe disconnect:${reason}`);
        },
      );
      throwIfAborted(abortInner.signal);

      // Step 1: load root doc
      await this.connectDoc(this.rootDoc, abortInner.signal);
      // Step 2: load subdocs
      this.state.subdocsLoadQueue.push(
        ...Array.from(this.rootDoc.getSubdocs()).map((doc) => ({
          id: doc.guid,
          doc,
        })),
      );

      this.reportSyncStatus();

      this.rootDoc.on('subdocs', this.handleSubdocsUpdate);

      // Finally: start sync
      await Promise.all([
        // load subdocs
        (async () => {
          while (throwIfAborted(abortInner.signal)) {
            // eslint-disable-next-line no-await-in-loop
            const subdoc = await this.state.subdocsLoadQueue.next(
              abortInner.signal,
            );
            this.state.subdocLoading = true;
            this.reportSyncStatus();
            // eslint-disable-next-line no-await-in-loop
            await this.connectDoc(subdoc.doc, abortInner.signal);
            this.state.subdocLoading = false;
            this.reportSyncStatus();
          }
        })(),
        // pull updates
        (async () => {
          while (throwIfAborted(abortInner.signal)) {
            // eslint-disable-next-line no-await-in-loop
            const { id, data } = await this.state.pullUpdatesQueue.next(
              abortInner.signal,
            );

            // don't apply empty data or Uint8Array([0, 0])
            if (
              !(
                data.byteLength === 0 ||
                (data.byteLength === 2 && data[0] === 0 && data[1] === 0)
              )
            ) {
              const subdoc = this.state.connectedDocs.get(id);
              if (subdoc) {
                applyUpdate(subdoc, data, this.name);
              }
            }
            this.reportSyncStatus();
          }
        })(),
        // push updates
        (async () => {
          while (throwIfAborted(abortInner.signal)) {
            // eslint-disable-next-line no-await-in-loop
            const { id, data } = await this.state.pushUpdatesQueue.next(
              abortInner.signal,
            );
            this.state.pushingUpdate = true;
            this.reportSyncStatus();
            const merged = mergeUpdates(data);
            // don't push empty data or Uint8Array([0, 0])
            if (
              !(
                merged.byteLength === 0 ||
                (merged.byteLength === 2 && merged[0] === 0 && merged[1] === 0)
              )
            ) {
              // eslint-disable-next-line no-await-in-loop
              await this.storage.push(id, merged);
            }
            this.state.pushingUpdate = false;
            this.reportSyncStatus();
          }
        })(),
      ]);
    } finally {
      dispose?.();
      for (const docs of this.state.connectedDocs.values()) {
        this.disconnectDoc(docs);
      }
      this.rootDoc.off('subdocs', this.handleSubdocsUpdate);
    }
  }

  private readonly state: {
    connectedDocs: Map<string, Doc>;
    pushUpdatesQueue: PriorityAsyncQueue<{
      id: string;
      data: Uint8Array[];
    }>;
    pushingUpdate: boolean;
    pullUpdatesQueue: PriorityAsyncQueue<{
      id: string;
      data: Uint8Array;
    }>;
    subdocLoading: boolean;
    subdocsLoadQueue: PriorityAsyncQueue<{ id: string; doc: Doc }>;
  } = {
    connectedDocs: new Map(),
    pushUpdatesQueue: new PriorityAsyncQueue([], this.priorityTarget),
    pushingUpdate: false,
    pullUpdatesQueue: new PriorityAsyncQueue([], this.priorityTarget),
    subdocLoading: false,
    subdocsLoadQueue: new PriorityAsyncQueue([], this.priorityTarget),
  };

  initState() {
    this.state.connectedDocs.clear();
    this.state.pushUpdatesQueue.clear();
    this.state.pullUpdatesQueue.clear();
    this.state.subdocsLoadQueue.clear();
    this.state.pushingUpdate = false;
    this.state.subdocLoading = false;
  }

  async connectDoc(doc: Doc, abort: AbortSignal) {
    const { data: docData, state: inStorageState } =
      (await this.storage.pull(doc.guid, encodeStateVector(doc))) ?? {};
    throwIfAborted(abort);

    if (docData) {
      applyUpdate(doc, docData, 'load');
    }

    // diff root doc and in-storage, save updates to pendingUpdates
    this.state.pushUpdatesQueue.push({
      id: doc.guid,
      data: [encodeStateAsUpdate(doc, inStorageState)],
    });

    this.state.connectedDocs.set(doc.guid, doc);

    // start listen root doc changes
    doc.on('update', this.handleYDocUpdates);

    // mark rootDoc as loaded
    doc.emit('sync', [true]);

    this.reportSyncStatus();
  }

  disconnectDoc(doc: Doc) {
    doc.off('update', this.handleYDocUpdates);
    this.state.connectedDocs.delete(doc.guid);
    this.reportSyncStatus();
  }

  // handle updates from ydoc
  handleYDocUpdates = (update: Uint8Array, origin: string, doc: Doc) => {
    // don't push updates from storage
    if (origin === this.name) {
      return;
    }

    const exist = this.state.pushUpdatesQueue.find(({ id }) => id === doc.guid);
    if (exist) {
      exist.data.push(update);
    } else {
      this.state.pushUpdatesQueue.push({
        id: doc.guid,
        data: [update],
      });
    }

    this.reportSyncStatus();
  };

  // handle subdocs changes, append new subdocs to queue, remove subdocs from queue
  handleSubdocsUpdate = ({
    added,
    removed,
  }: {
    added: Set<Doc>;
    removed: Set<Doc>;
  }) => {
    for (const subdoc of added) {
      this.state.subdocsLoadQueue.push({ id: subdoc.guid, doc: subdoc });
    }

    for (const subdoc of removed) {
      this.disconnectDoc(subdoc);
      this.state.subdocsLoadQueue.remove((doc) => doc.doc === subdoc);
    }
    this.reportSyncStatus();
  };

  reportSyncStatus() {
    let step;
    if (this.state.connectedDocs.size === 0) {
      step = SyncPeerStep.LoadingRootDoc;
    } else if (this.state.subdocsLoadQueue.length || this.state.subdocLoading) {
      step = SyncPeerStep.LoadingSubDoc;
    } else if (
      this.state.pullUpdatesQueue.length ||
      this.state.pushUpdatesQueue.length ||
      this.state.pushingUpdate
    ) {
      step = SyncPeerStep.Syncing;
    } else {
      step = SyncPeerStep.Synced;
    }

    this.status = {
      step,
      totalDocs:
        this.state.connectedDocs.size + this.state.subdocsLoadQueue.length,
      loadedDocs: this.state.connectedDocs.size,
      pendingPullUpdates:
        this.state.pullUpdatesQueue.length + (this.state.subdocLoading ? 1 : 0),
      pendingPushUpdates:
        this.state.pushUpdatesQueue.length + (this.state.pushingUpdate ? 1 : 0),
    };
  }

  async waitForLoaded(abort?: AbortSignal) {
    this.logger.debug('waiting for load');
    if (this.status.step > SyncPeerStep.Loaded) {
      this.logger.debug(
        'wait for loaded resolve with this.status.step > SyncPeerStep.Loaded',
      );
      return Promise.resolve();
    }
    return Promise.race([
      new Promise<void>((resolve) => {
        this.onStatusChange.subscribe((status) => {
          if (status.step > SyncPeerStep.Loaded) {
            this.logger.debug(
              'wait for loaded resolve with staus change, status: ',
              this.status,
            );
            resolve();
          }
        });
      }),
      new Promise((_, reject) => {
        if (abort?.aborted) {
          this.logger.debug(
            'wait for loaded rejected due to aborted 1 ',
            this.status,
          );
          reject(abort?.reason);
        }
        abort?.addEventListener('abort', () => {
          this.logger.debug(
            'wait for loaded rejected due to aborted 1 ',
            this.status,
          );
          reject(abort.reason);
        });
      }),
    ]);
  }
}
