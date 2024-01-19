// eslint-disable-next-line import/no-cycle
import { SearchExtension } from './search';

export { Search } from './search';

// hack: we cannot define type-safe decorator
// https://mirone.me/a-complete-guide-to-typescript-decorator/
export class WorkspaceExtension implements SearchExtension {
  search!: SearchExtension['search'];

  indexer!: SearchExtension['indexer'];
}
