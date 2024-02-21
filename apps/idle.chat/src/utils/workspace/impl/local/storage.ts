import { createIndexedDBStorage } from './indexdb';

// eslint-disable-next-line import/prefer-default-export
export const createLocalStorage = (workspaceId: string) =>
  createIndexedDBStorage(workspaceId);
