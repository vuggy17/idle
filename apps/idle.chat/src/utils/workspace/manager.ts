import { ID } from '@idle/model';
import { IdleWorkspace } from '../workspaceState';
import { BlobStorage } from './engine';
import { WorkspaceFactory } from './factory';
import { WorkspaceList } from './list';
import WorkspaceFlavour from './list/workspaceFlavour';
import { WorkspaceMetadata } from './metadata';
import { WorkspacePool } from './pool';
import Workspace from './workspace';

const logger = console;

export default class WorkspaceManager {
  pool: WorkspacePool = new WorkspacePool();

  constructor(
    public list: WorkspaceList,
    public factories: WorkspaceFactory[],
  ) {}

  /**
   * get workspace reference by metadata.
   *
   * You basically don't need to call this function directly, use the react hook `useWorkspace(metadata)` instead.
   *
   * @returns the workspace reference and a release function, don't forget to call release function when you don't
   * need the workspace anymore.
   */
  use(metadata: WorkspaceMetadata): {
    workspace: Workspace;
    release: () => void;
  } {
    const exist = this.pool.get(metadata.id);
    if (exist) {
      return exist;
    }

    const workspace = this.open(metadata);
    const ref = this.pool.put(workspace);

    return ref;
  }

  /**
   * delete workspace by metadata, same as `WorkspaceList.deleteWorkspace`
   */
  async deleteWorkspace(metadata: WorkspaceMetadata) {
    await this.list.delete(metadata);
  }

  /**
   * helper function to get blob without open workspace, its be used for download workspace avatars.
   */
  getWorkspaceBlob(metadata: WorkspaceMetadata, blobKey: string) {
    const factory = this.factories.find((x) => x.name === metadata.flavour);
    if (!factory) {
      throw new Error(`Unknown workspace flavour: ${metadata.flavour}`);
    }
    return factory.getWorkspaceBlob(metadata.id, blobKey);
  }

  private open(metadata: WorkspaceMetadata) {
    logger.info(`open workspace [${metadata.flavour}] ${metadata.id} `);
    const factory = this.factories.find((x) => x.name === metadata.flavour);
    if (!factory) {
      throw new Error(`Unknown workspace flavour: ${metadata.flavour}`);
    }
    const workspace = factory.openWorkspace(metadata);

    // sync information with workspace list, when workspace's avatar and name changed, information will be updated
    this.list.getInformation(metadata).syncWithWorkspace(workspace);

    return workspace;
  }

  createWorkspace(
    flavour: WorkspaceFlavour,
    initial: (
      workspace: IdleWorkspace,
      blobStorage: BlobStorage,
    ) => Promise<void>,
  ): Promise<ID> {
    logger.info(`create workspace [${flavour}]`);
    return this.list.create(flavour, initial);
  }
}
