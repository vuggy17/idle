import { IdleWorkspace } from '../../../workspace-state';
import { BlobEngine, SyncEngine, WorkspaceEngine } from '../../engine';
import { WorkspaceFactory } from '../../factory';
import Workspace from '../../workspace';
import { createIndexeddbBlobStorage } from './blob-indexeddb';
import { createLocalStorage } from './storage';

// eslint-disable-next-line import/prefer-default-export
export const localWorkspaceFactory: WorkspaceFactory = {
  name: 'local',
  openWorkspace(metadata) {
    const blobEngine = new BlobEngine(createIndexeddbBlobStorage(metadata.id), [
      // createStaticBlobStorage(),
    ]);
    const stateWorkspace = new IdleWorkspace({
      id: metadata.id,
      idGenerator: 'cuid',
      // blobStorages: [
      //   () => ({
      //     crud: blobEngine,
      //   }),
      // ],
      // idGenerator: () => nanoid(),
      // schema: globalBlockSuiteSchema,
    });

    const storage = createLocalStorage(metadata.id);

    const syncEngine = new SyncEngine(stateWorkspace.doc, storage, []);
    // const awarenessProvider = createBroadcastChannelAwarenessProvider(
    //   metadata.id,
    //   bs.awarenessStore.awareness,
    // );
    const engine = new WorkspaceEngine(blobEngine, syncEngine);

    // setupEditorFlags(bs);

    return new Workspace(metadata, engine, stateWorkspace);
  },
  async getWorkspaceBlob(id, blobKey) {
    const blobStorage = createIndexeddbBlobStorage(id);

    const blob = await blobStorage.get(blobKey);
    return blob;
  },
};
