import difference from 'lodash.difference';
import { applyUpdate, encodeStateAsUpdate } from 'yjs';
import { createId } from '@paralleldrive/cuid2';
import { IdleWorkspace } from '../../../workspace-state';
import { WorkspaceInfo, WorkspaceListProvider } from '../../list/provider';
import WorkspaceFlavour from '../../list/workspace-flavour';
import { WorkspaceMetadata } from '../../metadata';
import {
  LOCAL_WORKSPACE_CREATED_BROADCAST_CHANNEL_KEY,
  LOCAL_WORKSPACE_LOCAL_STORAGE_KEY,
} from './const';
import { createLocalStorage } from './storage';
import { createIndexeddbBlobStorage } from './blob-indexeddb';

// eslint-disable-next-line import/prefer-default-export
export function createLocalRoomListProvider(): WorkspaceListProvider {
  const notifyChannel = new BroadcastChannel(
    LOCAL_WORKSPACE_CREATED_BROADCAST_CHANNEL_KEY,
  );

  return {
    name: WorkspaceFlavour.LOCAL,

    /**
     * get workspaces list
     */
    getList() {
      return Promise.resolve(
        JSON.parse(
          localStorage.getItem(LOCAL_WORKSPACE_LOCAL_STORAGE_KEY) ?? '[]',
        ).map((id: string) => ({
          id,
          flavour: WorkspaceFlavour.LOCAL,
        })),
      );
    },

    /**
     * delete workspace by id
     */
    async delete(workspaceId) {
      const allWorkspaceIDs: string[] = JSON.parse(
        localStorage.getItem(LOCAL_WORKSPACE_LOCAL_STORAGE_KEY) ?? '[]',
      );
      localStorage.setItem(
        LOCAL_WORKSPACE_LOCAL_STORAGE_KEY,
        JSON.stringify(allWorkspaceIDs.filter((x) => x !== workspaceId)),
      );

      // call api to delete workspace

      // if (window.apis && environment.isDesktop) {
      //   await window.apis.workspace.delete(workspaceId);
      // }

      // notify all browser tabs, so they can update their workspace list
      notifyChannel.postMessage(workspaceId);
    },

    /**
     * create workspace
     * @param initial callback to put initial data to workspace
     */
    async create(initial) {
      function cuid() {
        return createId;
      }
      const id = createId();

      const blobStorage = createIndexeddbBlobStorage(id);
      const syncStorage = createLocalStorage(id);

      const workspace = new IdleWorkspace({
        id,
        idGenerator: 'cuid',
      });

      await initial(workspace, blobStorage);

      // save workspace to local storage
      await syncStorage.push(id, encodeStateAsUpdate(workspace.doc));
      for (const subdocs of workspace.doc.getSubdocs()) {
        // eslint-disable-next-line no-await-in-loop
        await syncStorage.push(subdocs.guid, encodeStateAsUpdate(subdocs));
      }

      // save workspace id to local storage
      const allWorkspaceIDs: string[] = JSON.parse(
        localStorage.getItem(LOCAL_WORKSPACE_LOCAL_STORAGE_KEY) ?? '[]',
      );
      allWorkspaceIDs.push(id);
      localStorage.setItem(
        LOCAL_WORKSPACE_LOCAL_STORAGE_KEY,
        JSON.stringify(allWorkspaceIDs),
      );

      // notify all browser tabs, so they can update their workspace list
      notifyChannel.postMessage(id);

      return id;
    },

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
    ) {
      let lastWorkspaceIDs: string[] = [];

      function scan() {
        const allWorkspaceIDs: string[] = JSON.parse(
          localStorage.getItem(LOCAL_WORKSPACE_LOCAL_STORAGE_KEY) ?? '[]',
        );
        const added = difference(allWorkspaceIDs, lastWorkspaceIDs);
        const deleted = difference(lastWorkspaceIDs, allWorkspaceIDs);
        lastWorkspaceIDs = allWorkspaceIDs;
        callback({
          added: added.map((id) => ({ id, flavour: WorkspaceFlavour.LOCAL })),
          deleted: deleted.map((id) => ({
            id,
            flavour: WorkspaceFlavour.LOCAL,
          })),
        });
      }

      scan();

      // rescan if other tabs notify us
      notifyChannel.addEventListener('message', scan);
      return () => {
        notifyChannel.removeEventListener('message', scan);
      };
    },

    /**
     * get workspace avatar and name by id
     *
     * @param id workspace id
     */
    async getInformation(id: string): Promise<WorkspaceInfo | undefined> {
      // get information from root doc

      const storage = await createLocalStorage(id);
      const data = await storage.pull(id, new Uint8Array([]));

      if (!data) {
        return undefined;
      }

      const wp = new IdleWorkspace({
        idGenerator: 'cuid',
        id,
      });

      applyUpdate(wp.doc, data.data);
      return {
        name: wp.meta.name,
        avatar: wp.meta.avatar,
      };
    },
  };
}
