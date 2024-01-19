import { ID } from '@idle/model';
import { Doc } from 'yjs';
// eslint-disable-next-line import/no-cycle
import { createId } from '@paralleldrive/cuid2';
// eslint-disable-next-line import/no-cycle
import Room from './room';
import IdleDoc from './doc';
import { StoreOptions } from './type';

export class Store {
  readonly id: ID;

  readonly doc: IdleDoc;

  rooms = new Map<ID, Room>();

  constructor(private options: StoreOptions) {
    this.id = this.options.id || this.generateId();
    this.doc = new IdleDoc({ guid: options.id });
  }

  generateId() {
    if (this.options.idGenerator === 'cuid') {
      return createId();
    }
    throw new Error(`Id generator not supported: ${this.options.idGenerator}`);
  }

  addRoom(room: Room) {
    this.rooms.set(room.id, room);
  }

  removeRoom(room: Room) {
    this.rooms.delete(room.id);
  }
}
