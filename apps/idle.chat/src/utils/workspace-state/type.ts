import { ID } from '@idle/model';

export type StoreOptions = {
  idGenerator: 'cuid';
  id?: ID;
};

export type WorkspaceOptions = StoreOptions; // alias purpose only
