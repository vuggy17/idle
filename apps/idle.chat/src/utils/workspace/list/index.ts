import { Subject } from 'rxjs';
import differenceWith from 'lodash.differencewith';
import { RoomInformation } from './information';
import { WorkspaceMetadata } from '../metadata';
import { readWorkspaceListCache, writeWorkspaceListCache } from './cache';
import { WorkspaceListProvider } from './provider';
import { BlockSuiteWorkspace, BlobStorage } from './BlockSuiteWorkspace';
import WorkspaceFlavour from './workspaceFlavour';

// TODO: implement
export interface WorkspaceListStatus {
  /**
   * is workspace list doing first loading.
   * if false, UI can display workspace not found page.
   */
  loading: boolean;
  workspaceList: WorkspaceMetadata[];
}

// TODO: implement
const logger = console;

export class WorkspaceList {
  private readonly abortController = new AbortController();

  private readonly roomInformationList = new Map<string, RoomInformation>();

  onStatusChanged = new Subject<WorkspaceListStatus>();

  private _status: Readonly<WorkspaceListStatus> = {
    loading: true,
    workspaceList: [],
  };

  get status() {
    return this._status;
  }

  set status(status) {
    this._status = status;
    // update cache
    writeWorkspaceListCache(status.workspaceList);
    this.onStatusChanged.next(this._status);
  }

  get workspaceList() {
    return this.status.workspaceList;
  }

  constructor(private readonly _providers: WorkspaceListProvider[]) {
    const cache = readWorkspaceListCache();
    const workspaceList = cache;
    this.status = {
      ...this.status,
      workspaceList,
    };

    // start first load
    this.startLoad();
  }

  /**
   * create workspace
   * @param flavour workspace flavour
   * @param initial callback to put initial data to workspace
   * @returns workspace id
   */
  async create(
    flavour: WorkspaceFlavour,
    initial: (
      workspace: BlockSuiteWorkspace,
      blobStorage: BlobStorage,
    ) => Promise<void>,
  ) {
    const provider = this._providers.find((x) => x.name === flavour);
    if (!provider) {
      throw new Error(`Unknown workspace flavour: ${flavour}`);
    }
    const id = await provider.create(initial);
    const metadata = {
      id,
      flavour,
    };
    // update workspace list
    this.status = this.addWorkspace(this.status, metadata);
    return id;
  }

  /**
   * delete workspace
   * @param roomMetadata
   */
  async delete(roomMetadata: WorkspaceMetadata) {
    logger.info(
      `delete workspace [${roomMetadata.flavour}] ${roomMetadata.id}`,
    );
    const provider = this._providers.find(
      (x) => x.name === roomMetadata.flavour,
    );
    if (!provider) {
      throw new Error(`Unknown workspace flavour: ${roomMetadata.flavour}`);
    }
    await provider.delete(roomMetadata.id);

    // delete workspace from list
    this.status = this.deleteWorkspace(this.status, roomMetadata);
  }

  /**
   * add workspace to list
   */
  // eslint-disable-next-line class-methods-use-this
  private addWorkspace(
    status: WorkspaceListStatus,
    metadata: WorkspaceMetadata,
  ) {
    if (status.workspaceList.some((x) => x.id === metadata.id)) {
      return status;
    }
    return {
      ...status,
      workspaceList: status.workspaceList.concat(metadata),
    };
  }

  /**
   * delete workspace from list
   */
  // eslint-disable-next-line class-methods-use-this
  private deleteWorkspace(
    status: WorkspaceListStatus,
    roomMetadata: WorkspaceMetadata,
  ) {
    if (!status.workspaceList.some((x) => x.id === roomMetadata.id)) {
      return status;
    }
    return {
      ...status,
      workspaceList: status.workspaceList.filter(
        (x) => x.id !== roomMetadata.id,
      ),
    };
  }

  /**
   * callback for subscribe workspaces list
   */
  private handleWorkspaceChange(changed: {
    added?: WorkspaceMetadata[];
    deleted?: WorkspaceMetadata[];
  }) {
    // eslint-disable-next-line prefer-destructuring
    let status = this.status;

    for (const added of changed.added ?? []) {
      status = this.addWorkspace(status, added);
    }
    for (const deleted of changed.deleted ?? []) {
      status = this.deleteWorkspace(status, deleted);
    }

    this.status = status;
  }

  /**
   * start first load workspace list
   */
  private startLoad() {
    for (const provider of this._providers) {
      // subscribe workspace list change
      const unsubscribe = provider.subscribe((changed) => {
        this.handleWorkspaceChange(changed);
      });

      // unsubscribe when abort
      if (this.abortController.signal.aborted) {
        unsubscribe();
        return;
      }
      this.abortController.signal.addEventListener('abort', () => {
        unsubscribe();
      });
    }

    this.revalidate()
      .catch((error) => {
        logger.error(`load workspace list error: ${error}`);
      })
      .finally(() => {
        this.status = {
          ...this.status,
          loading: false,
        };
      });
  }

  async revalidate() {
    await Promise.allSettled(
      this._providers.map(async (provider) => {
        try {
          const list = await provider.getList();
          const oldList = this.workspaceList.filter(
            (w) => w.flavour === provider.name,
          );
          this.handleWorkspaceChange({
            added: differenceWith(list, oldList, (a, b) => a.id === b.id),
            deleted: differenceWith(oldList, list, (a, b) => a.id === b.id),
          });
        } catch (error) {
          logger.error(`load workspace list error: ${error}`);
        }
      }),
    );
  }

  /**
   * get workspace information, if not exists, create it.
   */
  getInformation(meta: WorkspaceMetadata) {
    const exists = this.roomInformationList.get(meta.id);
    if (exists) {
      return exists;
    }

    return this.createInformation(meta);
  }

  private createInformation(roomMetadata: WorkspaceMetadata) {
    const provider = this._providers.find(
      (x) => x.name === roomMetadata.flavour,
    );
    if (!provider) {
      throw new Error(`Unknown workspace flavour: ${roomMetadata.flavour}`);
    }
    const information = new RoomInformation(roomMetadata, provider);
    information.fetch();
    this.roomInformationList.set(roomMetadata.id, information);
    return information;
  }

  dispose() {
    this.abortController.abort();
  }
}
