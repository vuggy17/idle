import type { Doc } from 'yjs';

import { Subject, Subscription } from 'rxjs';
import { stat } from 'fs';
import { SharedPriorityTarget } from '../utils/shared-priority-target';
import { MANUALLY_STOP, throwIfAborted } from '../utils/throw-if-aborted';
import { SyncEngineStep, SyncPeerStep } from './consts';
import { SyncPeer, type SyncPeerStatus } from './peer';
import type { SyncStorage } from './storage';
import { ConsoleLogger } from '../../logger';

export interface SyncEngineStatus {
  step: SyncEngineStep;
  main: SyncPeerStatus | null;
  shadow: (SyncPeerStatus | null)[];
  retrying: boolean;
}

/**
 * # SyncEngine
 *
 * ```
 *                    ┌────────────┐
 *                    │ SyncEngine │
 *                    └─────┬──────┘
 *                          │
 *                          ▼
 *                    ┌────────────┐
 *                    │  SyncPeer  │
 *          ┌─────────┤   local    ├─────────┐
 *          │         └─────┬──────┘         │
 *          │               │                │
 *          ▼               ▼                ▼
 *   ┌────────────┐   ┌────────────┐   ┌────────────┐
 *   │  SyncPeer  │   │  SyncPeer  │   │  SyncPeer  │
 *   │   Remote   │   │   Remote   │   │   Remote   │
 *   └────────────┘   └────────────┘   └────────────┘
 * ```
 *
 * Sync engine manage sync peers
 *
 * Sync steps:
 * 1. start local sync
 * 2. wait for local sync complete
 * 3. start remote sync
 * 4. continuously sync local and remote
 */
export class SyncEngine {
  priorityTarget = new SharedPriorityTarget();

  get rootDocId() {
    return this.rootDoc.guid;
  }

  logger = new ConsoleLogger('SyncEngine');

  private _status: SyncEngineStatus;

  onStatusChange = new Subject<SyncEngineStatus>();

  private setStatus(s: SyncEngineStatus) {
    this.logger.debug(`syne-engine:${this.rootDocId} status change`, s);

    this._status = s;
    this.onStatusChange.next(s);
  }

  get status() {
    return this._status;
  }

  private abort = new AbortController();

  constructor(
    private readonly rootDoc: Doc,
    private readonly local: SyncStorage,
    private readonly remotes: SyncStorage[],
  ) {
    this._status = {
      step: SyncEngineStep.Stopped,
      main: null,
      shadow: remotes.map(() => null),
      retrying: false,
    };
  }

  start() {
    if (this.status.step !== SyncEngineStep.Stopped) {
      this.forceStop();
    }
    this.abort = new AbortController();
    this.sync(this.abort.signal).catch((err) => {
      // should never reach here
      this.logger.error(err);
    });
  }

  canGracefulStop() {
    return !!this.status.main && this.status.main.pendingPushUpdates === 0;
  }

  async waitForGracefulStop(abort?: AbortSignal) {
    await Promise.race([
      new Promise((_, reject) => {
        if (abort?.aborted) {
          reject(abort?.reason);
        }
        abort?.addEventListener('abort', () => {
          reject(abort.reason);
        });
      }),
      new Promise<void>((resolve) => {
        this.onStatusChange.subscribe(() => {
          if (this.canGracefulStop()) {
            resolve();
          }
        });
      }),
    ]);
    throwIfAborted(abort);
    this.forceStop();
  }

  forceStop() {
    console.debug('force stop call');
    this.abort.abort(MANUALLY_STOP);
    this._status = {
      step: SyncEngineStep.Stopped,
      main: null,
      shadow: this.remotes.map(() => null),
      retrying: false,
    };
  }

  // main sync process, should never return until abort
  async sync(signal: AbortSignal) {
    const state: {
      localPeer: SyncPeer | null;
      remotePeers: (SyncPeer | null)[];
    } = {
      localPeer: null,
      remotePeers: this.remotes.map(() => null),
    };

    const cleanUp: Subscription[] = [];
    try {
      // Step 1: start local sync peer
      state.localPeer = new SyncPeer(
        this.rootDoc,
        this.local,
        this.priorityTarget,
      );

      const subscriber = state.localPeer.onStatusChange.subscribe(() => {
        if (!signal.aborted)
          this.updateSyncingState(state.localPeer, state.remotePeers);
      });
      cleanUp.push(subscriber);

      this.updateSyncingState(state.localPeer, state.remotePeers);

      // Step 2: wait for local sync complete
      await state.localPeer.waitForLoaded(signal);
      this.logger.debug('local peer loaded, document should be ready now');
      this.logger.debug('root doc state', this.rootDoc);

      // Step 3: start remote sync peer
      // state.remotePeers = this.remotes.map((remote) => {
      //   console.log('ccc');
      //   const peer = new SyncPeer(this.rootDoc, remote, this.priorityTarget);
      //   cleanUp.push(
      //     peer.onStatusChange.subscribe(() => {
      //       if (!signal.aborted)
      //         this.updateSyncingState(state.localPeer, state.remotePeers);
      //     }).unsubscribe,
      //   );
      //   return peer;
      // });

      this.updateSyncingState(state.localPeer, state.remotePeers);

      // Step 4: continuously sync local and remote

      // wait for abort
      await new Promise((_, reject) => {
        if (signal.aborted) {
          reject(signal.reason);
        }
        signal.addEventListener('abort', () => {
          reject(signal.reason);
        });
      });
    } catch (error) {
      if (error === MANUALLY_STOP || signal.aborted) {
        console.log('MANUALLY_STOP');
        return;
      }
      throw error;
    } finally {
      // stop peers
      state.localPeer?.stop();
      for (const remotePeer of state.remotePeers) {
        remotePeer?.stop();
      }
      for (const subscription of cleanUp) {
        subscription.unsubscribe();
      }
    }
  }

  updateSyncingState(main: SyncPeer | null, shadow: (SyncPeer | null)[]) {
    let step = SyncEngineStep.Synced;
    const allPeer = [main, ...shadow];
    for (const peer of allPeer) {
      if (!peer || peer.status.step !== SyncPeerStep.Synced) {
        step = SyncEngineStep.Syncing;
        break;
      }
    }
    this.setStatus({
      step,
      main: main?.status ?? null,
      shadow: shadow.map((peer) => peer?.status ?? null),
      retrying: allPeer.some(
        (peer) => peer?.status.step === SyncPeerStep.Retrying,
      ),
    });
  }

  async waitForSynced(abort?: AbortSignal) {
    if (this.status.step === SyncEngineStep.Synced) {
      // added
      return Promise.resolve();
    }
    return Promise.race([
      new Promise<void>((resolve) => {
        this.onStatusChange.subscribe((status) => {
          if (status.step === SyncEngineStep.Synced) {
            resolve();
          }
        });
      }),
      new Promise((_, reject) => {
        if (abort?.aborted) {
          reject(abort?.reason);
        }
        abort?.addEventListener('abort', () => {
          reject(abort.reason);
        });
      }),
    ]);
  }

  async waitForLoadedRootDoc(abort?: AbortSignal) {
    function isLoadedRootDoc(status: SyncEngineStatus) {
      return ![status.main, ...status.shadow].some(
        (peer) => !peer || peer.step <= SyncPeerStep.LoadingRootDoc,
      );
    }
    if (isLoadedRootDoc(this.status)) {
      // added
      return Promise.resolve();
    }
    return Promise.race([
      new Promise<void>((resolve) => {
        this.onStatusChange.subscribe((status) => {
          if (isLoadedRootDoc(status)) {
            resolve();
          }
        });
      }),
      new Promise((_, reject) => {
        if (abort?.aborted) {
          reject(abort?.reason);
        }
        abort?.addEventListener('abort', () => {
          reject(abort.reason);
        });
      }),
    ]);
  }

  setPriorityRule(target: ((id: string) => boolean) | null) {
    this.priorityTarget.priorityRule = target;
  }
}
