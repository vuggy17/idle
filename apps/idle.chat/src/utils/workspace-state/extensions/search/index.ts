import { WorkspaceOptions } from '../../type';
import { extensionFactory } from '../factory';
import { QueryContent, RoomIndexer } from './search';

type Indexer = {
  room: RoomIndexer;
};

export interface SearchExtension {
  indexer: Indexer;
  search: (query: QueryContent) => Map<string, string>;
}

export const Search = extensionFactory<keyof SearchExtension>(
  (originalClass) =>
    class extends originalClass {
      indexer: Indexer;

      search(query: QueryContent) {
        return this.indexer.room.search(query);
      }

      constructor(storeOptions: WorkspaceOptions) {
        super(storeOptions);
        this.indexer = {
          room: new RoomIndexer(this.doc, this.meta),
        };
      }
    },
);
