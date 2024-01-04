import { ID } from '@idle/model';
import { Doc } from 'yjs';
// eslint-disable-next-line import/no-cycle
import Room from './room';
import IdleDoc from './doc';

export type StoreOptions = {
  idGenerator: 'cuid' | 'nanoid';
  id?: ID;
};

export class Store {
  readonly id: ID;

  readonly doc: IdleDoc;

  rooms = new Map<ID, Room>();

  constructor(private options: StoreOptions) {
    this.id = this.options.id || this.generateId();
    this.doc = new IdleDoc();
  }

  generateId() {
    if (this.options.idGenerator === 'cuid') {
      return 'clqvtjlo3000008jvg6yyfhr9';
    }
    return 'rIWoU8BURBAsyoLO-SuTA';
  }

  addRoom(room: Room) {
    this.rooms.set(room.id, room);
    console.log('room added');
    console.log(this.rooms);
  }

  removeRoom(room: Room) {
    this.rooms.delete(room.id);
  }
}
