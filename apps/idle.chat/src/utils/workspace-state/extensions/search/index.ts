import { WorkspaceOptions } from '../../type';
import { extensionFactory } from '../factory';
import { QueryContent, SearchIndexer } from './search';

type Indexer = {
  search: SearchIndexer;
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
        console.log('serach');
        return this.indexer.search.search(query);
      }

      constructor(storeOptions: WorkspaceOptions) {
        super(storeOptions);
        this.indexer = {
          search: new SearchIndexer(this.doc, this.meta),
        };
      }
    },
);
