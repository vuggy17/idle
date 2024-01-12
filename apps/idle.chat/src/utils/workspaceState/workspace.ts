import { Subject } from 'rxjs';
import { ID } from '@idle/model';
import WorkspaceMeta, { RoomMeta, RoomType } from './meta';
// eslint-disable-next-line import/no-cycle
import Room from './room';
import { Store, StoreOptions } from './store';

export default class IdleWorkspace {
  private readonly _store: Store;

  readonly meta: WorkspaceMeta;

  events = {
    roomAdded: new Subject<ID>(),
    roomRemoved: new Subject<ID>(),
    roomMetaUpdated: new Subject<void>(),
  };

  constructor(options: StoreOptions) {
    this._store = new Store(options);
    this.meta = new WorkspaceMeta(this.doc);
    this._bindRoomMetaEvents();
  }

  get id() {
    return this._store.id;
  }

  get doc() {
    return this._store.doc;
  }

  get rooms() {
    return this._store.rooms;
  }

  private _hasRoom(id: ID) {
    return this.rooms.has(id);
  }

  getRoom(id: ID): Room | null {
    return this._store.rooms.get(id) ?? null;
  }

  private _bindRoomMetaEvents() {
    this.meta.roomMetaAdded.subscribe((roomId) => {
      const room = new Room({
        id: roomId,
        doc: this.doc,
        workspace: this,
      });
      this._store.addRoom(room);
      this.events.roomAdded.next(room.id);
    });

    this.meta.roomMetaRemoved.subscribe((roomId) => {
      const room = this.getRoom(roomId);
      if (room) {
        this._store.removeRoom(room);
        this.events.roomRemoved.next(room.id);
        // TODO: delete space from root doc
      }
    });

    this.events.roomMetaUpdated.next();
  }

  /**
   * By default, only an empty page will be created.
   * If the `init` parameter is passed, a `surface`, `note`, and `paragraph` block
   * will be created in the page simultaneously.
   */
  createRoom(options: { id?: string; members: ID[]; type: RoomType }) {
    const { id, members, type } = options;
    const roomId = id ?? this._store.generateId();
    if (this._hasRoom(roomId)) {
      throw new Error('room already exists');
    }

    this.meta.addRoomMeta({
      id: roomId,
      title: 'New chat room',
      createDate: +new Date(),
      members,
      type,
    });
    return this.getRoom(roomId) as Room;
  }

  /** Update page meta state. Note that this intentionally does not mutate page state. */
  setRoomMeta(
    pageId: string,
    // You should not update subpageIds directly.
    props: Partial<RoomMeta>,
  ) {
    this.meta.setRoomMeta(pageId, props);
  }

  removeRoom(roomId: ID) {
    try {
      const roomMeta = this.meta.getRoomMeta(roomId);
      if (!roomMeta) throw new Error(`Cannot delete room ${roomId}`);

      const room = this.getRoom(roomId);
      if (!room) return;

      room.dispose();
      this.meta.removeRoomMeta(roomId);
      this._store.removeRoom(room);
    } catch (error) {
      console.log(error);
    }
  }
}
