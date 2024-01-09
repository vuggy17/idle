import { WorkspaceMetadata } from '../metadata';
import WorkspaceFlavour from './workspaceFlavour';
import { BlockSuiteWorkspace, BlobStorage } from './BlockSuiteWorkspace';

export interface WorkspaceInfo {
  avatar?: string;
  name?: string;
}

export interface WorkspaceListProvider {
  name: WorkspaceFlavour;

  /**
   * get workspaces list
   */
  getList(): Promise<WorkspaceMetadata[]>;

  /**
   * delete workspace by id
   */
  delete(workspaceId: string): Promise<void>;

  /**
   * create workspace
   * @param initial callback to put initial data to workspace
   */
  create(
    initial: (
      workspace: BlockSuiteWorkspace,
      blobStorage: BlobStorage,
    ) => Promise<void>,
  ): Promise<string>;

  /**
   * Start subscribe workspaces list
   *
   * @returns unsubscribe function
   */
  subscribe(
    callback: (changed: {
      added?: WorkspaceMetadata[];
      deleted?: WorkspaceMetadata[];
    }) => void,
  ): () => void;

  /**
   * get workspace avatar and name by id
   *
   * @param id workspace id
   */
  getInformation(id: string): Promise<WorkspaceInfo | undefined>;
}
