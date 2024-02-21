import { DocumentWorkspace } from '../../../workspace-state';
import { BlobEngine, WorkspaceEngine } from '../../engine';
import { WorkspaceFactory } from '../../factory';
import Workspace from '../../workspace';
import { createIndexeddbBlobStorage } from './blob-indexeddb';
import { createLocalStorage } from './storage';

// eslint-disable-next-line import/prefer-default-export
export const localWorkspaceFactory: WorkspaceFactory = {
  name: 'local',
  openWorkspace(metadata) {
    const blobEngine = new BlobEngine(
      createIndexeddbBlobStorage(metadata.id),
      [],
    );
    const storage = createLocalStorage(metadata.id);

    const documentWorkspace = new DocumentWorkspace({
      id: metadata.id,
      idGenerator: 'cuid',
      docSources: {
        main: storage,
        shadow: [],
      },
    });

    const engine = new WorkspaceEngine(
      blobEngine,
      documentWorkspace.syncEngine,
    );

    return new Workspace(metadata, engine, documentWorkspace);
  },
  async getWorkspaceBlob(id, blobKey) {
    const blobStorage = createIndexeddbBlobStorage(id);

    const blob = await blobStorage.get(blobKey);
    return blob;
  },
};
