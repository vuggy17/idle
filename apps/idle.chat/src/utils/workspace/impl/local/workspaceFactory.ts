import { IdleWorkspace } from '../../../workspaceState';
import { BlobEngine, SyncEngine, WorkspaceEngine } from '../../engine';
import { WorkspaceFactory } from '../../factory';
import Workspace from '../../workspace';
import { createIndexeddbBlobStorage } from './blobIndexeddb';
import { createLocalStorage } from './storage';

// eslint-disable-next-line import/prefer-default-export
export const localWorkspaceFactory: WorkspaceFactory = {
  name: 'local',
  openWorkspace(metadata) {
    const blobEngine = new BlobEngine(createIndexeddbBlobStorage(metadata.id), [
      // createStaticBlobStorage(),
    ]);
    const bs = new IdleWorkspace({
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
    // const syncEngine = new SyncEngine(
    //   bs.doc,
    //   createLocalStorage(metadata.id),
    //   [],
    // );
    // const awarenessProvider = createBroadcastChannelAwarenessProvider(
    //   metadata.id,
    //   bs.awarenessStore.awareness,
    // );
    // const engine = new WorkspaceEngine(blobEngine, syncEngine, [
    //   awarenessProvider,
    // ]);

    // setupEditorFlags(bs);

    return new Workspace(metadata, bs);
  },
  async getWorkspaceBlob(id, blobKey) {
    const blobStorage = createIndexeddbBlobStorage(id);

    const blob = await blobStorage.get(blobKey);
    return blob;
  },
};
