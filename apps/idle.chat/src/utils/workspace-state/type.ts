import { ID } from '@idle/model';
import { SyncStorage } from '../workspace/engine';
import { Logger } from '../logger';

export type StoreOptions = {
  idGenerator: 'cuid';
  id?: ID;
  docSources: {
    main: SyncStorage;
    shadow: SyncStorage[];
  };
  logger?: Logger;
};

export type WorkspaceOptions = StoreOptions; // alias purpose only
