import { createStore, del, get, keys, set } from 'idb-keyval';

import type { BlobStorage } from '../../engine/blob';

// eslint-disable-next-line import/prefer-default-export
export const createIndexeddbBlobStorage = (
  workspaceId: string,
): BlobStorage => {
  const db = createStore(`${workspaceId}_blob`, 'blob');
  const mimeTypeDb = createStore(`${workspaceId}_blob_mime`, 'blob_mime');
  return {
    name: 'indexeddb',
    readonly: false,
    get: async (key: string) => {
      const res = await get<ArrayBuffer>(key, db);
      if (res) {
        return new Blob([res]);
      }
      return null;
    },
    set: async (key: string, value: Blob) => {
      await set(key, await value.arrayBuffer(), db);
      await set(key, value.type, mimeTypeDb);
      return key;
    },
    delete: async (key: string) => {
      await del(key, db);
      await del(key, mimeTypeDb);
    },
    list: async () => {
      return keys<string>(db);
    },
  };
};
