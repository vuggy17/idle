import FlexSearch, { DocumentSearchOptions } from 'flexsearch';
import Y, { Doc } from 'yjs';
import IdleDoc from '../../doc';
import WorkspaceMeta from '../../meta';
import { assertExists } from '../../../assert';

const REINDEX_TIMEOUT = 3000;
const DocumentIndexer = FlexSearch.Document;
const { Index } = FlexSearch;

type IndexMeta = Readonly<{
  content: string; // chat name, member name, message text
  members: {
    id: string;
    name: string;
    avatar: string;
  }[];
}>;

export type QueryContent = string | Partial<DocumentSearchOptions<boolean>>;
type SearchResult = {
  id: string;
  doc: { content: string; members: string[] };
};
type SearchResults = { field: string; result: SearchResult[] };

function tokenize(locale: string) {
  const Tokenizer = Intl.Segmenter;
  if (Tokenizer) {
    // extract the latin encoder inside flexsearch
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const latinIndexer: any = new Index({ charset: 'latin:advanced' });
    const latinEncoder = latinIndexer.encode.bind(latinIndexer);
    // check latin characters
    const latinChecker = /^[\p{Script=Latin}\p{Mark}\d]+$/u;

    const segmenter = new Tokenizer([locale], { granularity: 'word' });
    return (text: string) => {
      const latinChars: string[] = [];
      const cjkChars = Array.from(segmenter.segment(text))
        .filter((s) => {
          if (s.isWordLike) {
            if (!latinChecker.test(s.segment)) {
              return true;
            }
            latinChars.push(s.segment);
          }
          return false;
        })
        .map((s) => s.segment);

      return [...cjkChars, ...latinEncoder(latinChars.join(' '))];
    };
  }
  return (text: string) => {
    // eslint-disable-next-line no-control-regex
    return text.replace(/[\x00-\x7F]/g, '').split('');
  };
}

export class SearchIndexer {
  private readonly _indexer: FlexSearch.Document<IndexMeta, string[]>;

  private _reindexMap: Map<string, IndexMeta> | null = null;

  constructor(
    private readonly _doc: IdleDoc,
    private readonly _meta: WorkspaceMeta, // for metadata retrieval
    locale = 'en-US',
  ) {
    this._indexer = new DocumentIndexer<IndexMeta, string[]>({
      document: {
        id: 'id',
        index: ['content'],
        store: ['content', 'members'],
      },
      encode: tokenize(locale),
      tokenize: 'forward',
      context: true,
    });
    this._reindexMap = new Map();
    this._reindex();

    // fixme(Mirone): use better way to listen to page changes
    this._doc.rooms.observe((event) => {
      event.keysChanged.forEach((roomId) => {
        const room = this._getRoom(roomId);

        if (room != null) {
          if (room.isLoaded) {
            this._handleRoomIndexing(roomId, room);
          } else {
            // since metadata is set async, we need to wait for the room to load
            room.once('load', () => {
              this._handleRoomIndexing(roomId, room);
            });
          }
        }
      });
    });

    window.addEventListener('beforeunload', () => {
      this._reindexMap = null;
    });
  }

  private _handleRoomIndexing(roomId: any, room: Doc) {
    if (!room) {
      return;
    }
    this.refreshRoomIndex(roomId);
    // const messages = room.getArray('messages');
    // messages.observeDeep((events) => {
    //   const keys = events.flatMap((e) => {
    //     // eslint-disable-next-line no-bitwise
    //     if ((e.path?.length | 0) > 0) {
    //       return [[e.path[0], 'update'] as [string, 'update']];
    //     }
    //     return Array.from(e.changes.keys.entries()).map(
    //       ([k, { action }]) => [k, action] as [string, typeof action],
    //     );
    //   });

    //   if (keys.length) {
    //     keys.forEach(([key, action]) => {
    //       this._refreshIndex(roomId, key, action, messages.get(key));
    //     });
    //   }
    // });
  }

  refreshRoomIndex(roomId: any) {
    const meta = this._meta.getRoomMeta(roomId);
    assertExists(meta);
    // this._refreshIndex(roomId, key, 'add', meta);

    this._reindexMap?.set(roomId, {
      content: meta.title,
      members: meta.members,
    });

    // const yBlocks = room.getMap('blocks') as Y.Map<unknown>;
    // yBlocks.forEach((_, key) => {
    //   this._refreshIndex(roomId, key, 'add', yBlocks.get(key));
    // });
    // console.log(room.);
  }

  private _getRoom(key: string) {
    try {
      return this._doc.rooms.get(key);
    } catch (_) {
      return undefined;
    }
  }

  private _reindex = () => {
    if (!this._reindexMap) return;

    for (const id of this._reindexMap.keys()) {
      const meta = this._reindexMap.get(id);
      if (meta) {
        this._reindexMap.delete(id);
        this._indexer.add(id, meta);
      }
    }

    setTimeout(() => {
      if (!this._reindexMap) return;
      requestIdleCallback(this._reindex, { timeout: 1000 });
    }, REINDEX_TIMEOUT);
  };

  search(query: QueryContent) {
    return new Map(
      this._search(query).flatMap(({ result }) =>
        result.map((r) => [
          r.id,
          { content: r.doc.content, members: r.doc.members },
        ]),
      ),
    );
  }

  private _search(query: QueryContent): SearchResults[] {
    if (typeof query === 'object') {
      return this._indexer.search({
        ...query,
        enrich: true,
      }) as unknown as SearchResults[];
    }
    return this._indexer.search(query, {
      enrich: true,
    }) as unknown as SearchResults[];
  }

  private _refreshIndex(
    page: string,
    id: string,
    action: 'add' | 'update' | 'delete',
    message?: Y.Map<unknown>,
  ) {
    switch (action) {
      case 'add':
      case 'update': {
        if (message) {
          const content = message.get('text') as string;
          assertExists(content);
          if (content) {
            this._reindexMap?.set(id, {
              content,
              // space: page,
              // tags: [page],
            });
          }
        }
        break;
      }
      case 'delete': {
        this._reindexMap?.delete(id);
        this._indexer.remove(id);
        break;
      }
    }
  }
}
