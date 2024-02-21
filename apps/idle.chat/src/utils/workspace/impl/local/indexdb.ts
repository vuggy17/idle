import { type DBSchema, type IDBPDatabase, openDB } from 'idb';
import { diffUpdate, encodeStateVectorFromUpdate } from 'yjs';
import { ID } from '@idle/model';
import { SyncStorage } from '../../sync/storage';
import mergeUpdates from '../../utils/merge-updates';

type UpdateMessage = {
  timestamp: number;
  update: Uint8Array;
};

type RoomPersist = {
  id: string;
  updates: UpdateMessage[];
};

interface BlockSuiteBinaryDB extends DBSchema {
  workspace: {
    key: string;
    value: RoomPersist;
  };
  milestone: {
    key: string;
    value: unknown;
  };
}

export function upgradeDB(db: IDBPDatabase<BlockSuiteBinaryDB>) {
  db.createObjectStore('workspace', { keyPath: 'id' });
  db.createObjectStore('milestone', { keyPath: 'id' });
}

type ChannelMessage = {
  type: 'db-updated';
  payload: { docId: string; update: Uint8Array };
};

export const dbVersion = 1;
export const DEFAULT_DB_NAME = 'local';

export class IndexDBStorage implements SyncStorage {
  private readonly _name = 'indexdb';

  private readonly _mergeCount = 1; // how many update snapshot kept for each workspace

  private readonly _notifier: BroadcastChannel;

  private _db: IDBPDatabase<BlockSuiteBinaryDB> | null = null;

  constructor(
    private readonly getDatabaseFn: () => Promise<
      IDBPDatabase<BlockSuiteBinaryDB>
    >,
    private readonly _roomId: ID,
  ) {
    this._notifier = new BroadcastChannel(`${this.name}:${this._roomId}`);
  }

  get name() {
    return this._name;
  }

  private async getDb() {
    if (!this._db) {
      this._db = await this.getDatabaseFn();
    }
    return this._db;
  }

  async pull(
    docId: string,
    state: Uint8Array,
  ): Promise<{ data: Uint8Array; state?: Uint8Array | undefined } | null> {
    const db = await this.getDb();
    const store = db
      .transaction('workspace', 'readonly')
      .objectStore('workspace');
    const data = await store.get(docId);

    if (!data) {
      return null;
    }

    const { updates } = data;
    const update = mergeUpdates(updates.map((doc) => doc.update));

    const diff = state.length ? diffUpdate(update, state) : update;

    return { data: diff, state: encodeStateVectorFromUpdate(update) };
  }

  async push(docId: string, update: Uint8Array): Promise<void> {
    const db = await this.getDb();
    const store = db
      .transaction('workspace', 'readwrite')
      .objectStore('workspace');

    // TODO: maybe we do not need to get data every time
    const { updates } = (await store.get(docId)) ?? { updates: [] };
    let rows: UpdateMessage[] = [...updates, { timestamp: Date.now(), update }];
    if (this._mergeCount && rows.length >= this._mergeCount) {
      const merged = mergeUpdates(rows.map((doc) => doc.update));
      rows = [{ timestamp: Date.now(), update: merged }];
    }
    await store.put({
      id: docId,
      updates: rows,
    });
    this._notifier.postMessage({
      type: 'db-updated',
      payload: { docId, update },
    } satisfies ChannelMessage);
  }

  async subscribe(
    cb: (docId: string, data: Uint8Array) => void,
    _disconnect: (reason: string) => void,
  ): Promise<() => void> {
    function onMessage(event: MessageEvent<ChannelMessage>) {
      const { type, payload } = event.data;
      if (type === 'db-updated') {
        const { docId, update } = payload;
        cb(docId, update);
      }
    }
    this._notifier.addEventListener('message', onMessage);
    return () => {
      this._notifier.removeEventListener('message', onMessage);
    };
  }
}

export function createIndexedDBStorage(
  profileId: string,
  dbName = DEFAULT_DB_NAME,
  mergeCount = 1,
) {
  const getDb = async () => {
    return openDB<BlockSuiteBinaryDB>(dbName, dbVersion, {
      upgrade: upgradeDB,
    });
  };

  return new IndexDBStorage(getDb, profileId);
}
