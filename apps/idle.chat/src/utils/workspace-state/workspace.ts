import { Subject } from 'rxjs';
import { ID } from '@idle/model';
import WorkspaceMeta, { RoomMeta, RoomType } from './meta';
// eslint-disable-next-line import/no-cycle
import Room from './room';
import { Store } from './store';
import { WorkspaceOptions } from './type';
import { User } from '../../features/auth/entities/user';
import { Search, WorkspaceExtension } from './extensions';

@Search
export default class DocumentWorkspace extends WorkspaceExtension {
  private readonly _store: Store;

  readonly meta: WorkspaceMeta;

  events = {
    roomAdded: new Subject<ID>(),
    roomRemoved: new Subject<ID>(),
    roomsUpdated: new Subject<void>(),
  };

  constructor(options: WorkspaceOptions) {
    super();
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

  get syncEngine() {
    return this._store.syncEngine;
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
    this.meta.roomMetaAdded.subscribe((meta) => {
      const room = new Room({
        id: meta.id,
        doc: this.doc,
        workspace: this,
        meta,
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

    this.meta.roomMetasUpdated.subscribe(() => {
      this.events.roomsUpdated.next();
    });
  }

  /**
   * By default, only an empty page will be created.
   * If the `init` parameter is passed, a `surface`, `note`, and `paragraph` block
   * will be created in the page simultaneously.
   */
  createRoom(options: {
    id?: ID;
    members: User[];
    type: RoomType;
    title?: string;
    avatar?: string;
  }) {
    function generateAvatar() {
      return '';
    }

    const DEFAULT_ROOM_NAME = 'New chat';
    const { id, members, type, title } = options;
    const roomId = id || this._store.idGenerator();
    if (this._hasRoom(roomId)) {
      throw new Error('room already exists');
    }
    const avatar = options.avatar || generateAvatar();

    this.meta.addRoomMeta({
      id: roomId,
      title: title || DEFAULT_ROOM_NAME,
      createDate: +new Date(),
      members,
      type,
      avatar,
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

  start() {
    this.syncEngine.start();
  }
}
