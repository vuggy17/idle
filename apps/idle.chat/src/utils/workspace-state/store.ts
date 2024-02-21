import { ID } from '@idle/model';
// eslint-disable-next-line import/no-cycle
import { createId } from '@paralleldrive/cuid2';
// eslint-disable-next-line import/no-cycle
import Room from './room';
import IdleDoc from './doc';
import { StoreOptions } from './type';
import { SyncEngine } from '../workspace/engine';

export class Store {
  readonly id: ID;

  readonly doc: IdleDoc;

  readonly syncEngine: SyncEngine;

  readonly idGenerator: () => string;

  rooms = new Map<ID, Room>();

  constructor(private options: StoreOptions) {
    this.idGenerator = createId;
    this.id = this.options.id || createId();
    this.doc = new IdleDoc({ guid: options.id });

    this.syncEngine = new SyncEngine(
      this.doc,
      options.docSources.main,
      options.docSources.shadow ?? [],
    );
  }

  addRoom(room: Room) {
    this.rooms.set(room.id, room);
  }

  removeRoom(room: Room) {
    this.rooms.delete(room.id);
  }
}
