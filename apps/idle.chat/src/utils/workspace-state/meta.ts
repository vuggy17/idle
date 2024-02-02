import { ID } from '@idle/model';
import { Subject } from 'rxjs';
import { Binder } from 'immer-yjs/src';
import { Array as YArray, Map as YMap, Text as YText, YEvent } from 'yjs';
import IdleDoc from './doc';
import { User } from '../../features/auth/entities/user';

const RoomVariants = {
  private: 'private',
  group: 'group',
} as const;
export type RoomType = keyof typeof RoomVariants;

export interface RoomMeta {
  id: ID;
  title: string;
  avatar: string;
  createDate: number;
  members: User[];
  type: RoomType;
}

export type WorkspaceMetadataState = {
  name: string;
  avatar: string;
  rooms: any[];
};

export default class WorkspaceMeta {
  readonly id: ID = 'meta';

  private _prevRooms = new Set<string>();

  _doc: IdleDoc;

  _yMap: YMap<WorkspaceMetadataState>;

  roomMetaAdded = new Subject<RoomMeta>();

  roomMetaRemoved = new Subject<ID>();

  roomMetasUpdated = new Subject<void>();

  commonFieldsUpdated = new Subject<void>();

  randomValue = 0;

  protected readonly _proxy: WorkspaceMetadataState;

  protected readonly binder: Binder<WorkspaceMetadataState>;

  constructor(doc: IdleDoc) {
    this._doc = doc;
    this._yMap = doc.getMap(this.id);
    const { proxy, binder } = doc.getMapProxy<WorkspaceMetadataState>(this.id);
    this.binder = binder;
    this._proxy = proxy;
    this._yMap.observeDeep(this.handleMetaDocChange.bind(this));
  }

  private _handleCommonFieldsEvent() {
    this.commonFieldsUpdated.next();
  }

  private _handleRomMetaEvent() {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const { roomMetas, _prevRooms } = this;

    roomMetas.forEach((meta) => {
      if (!_prevRooms.has(meta.id)) {
        this.roomMetaAdded.next(meta);
      }
    });

    _prevRooms.forEach((prevPageId) => {
      const isRemoved = !roomMetas.find((p) => p.id === prevPageId);
      if (isRemoved) {
        this.roomMetaRemoved.next(prevPageId);
      }
    });

    _prevRooms.clear();
    roomMetas.forEach((page) => _prevRooms.add(page.id));

    this.roomMetasUpdated.next();
  }

  get yMap() {
    return this._doc.getMap(this.id);
  }

  get roomMetas() {
    if (!this._proxy.rooms) {
      return [] as RoomMeta[];
    }
    return [...(this._proxy.rooms as RoomMeta[])];
  }

  get yRooms() {
    return this._yMap.get('rooms') as unknown as YArray<unknown>;
  }

  get name() {
    return this._proxy.name;
  }

  setName(newName: string) {
    this._proxy.name = newName;
  }

  get avatar() {
    return this._proxy.avatar;
  }

  set avatar(avt: string) {
    this._proxy.avatar = avt;
  }

  get rooms() {
    return this._proxy.rooms;
  }

  getRoomMeta(roomID: ID) {
    return this.roomMetas.find((room) => room.id === roomID);
  }

  addRoomMeta(room: RoomMeta, index?: number) {
    if (!this.rooms) {
      this._proxy.rooms = [];
    }

    this.binder.update((doc) => {
      if (index === undefined) {
        doc.rooms.push(room);
      } else {
        doc.rooms.splice(index, 0, room);
      }
    });
  }

  removeRoomMeta(roomId: ID) {
    if (!this.rooms) throw new Error('No rooms existed to delete');

    const index = this.roomMetas.findIndex((room) => room.id === roomId);
    if (index < 0) return;

    this.binder.update((doc) => {
      doc.rooms.splice(index, 1);
    });
  }

  /**
   * @internal Use {@link Workspace.setRoomMeta} instead
   */
  setRoomMeta(id: string, props: Partial<RoomMeta>) {
    this.binder.update((doc) => {
      const rooms = (doc.rooms as RoomMeta[]) ?? [];
      const index = rooms.findIndex((page: RoomMeta) => id === page.id);

      if (!this.rooms) {
        this._proxy.rooms = [];
      }
      if (index === -1) return;
      if (!this.rooms) throw new Error('setRoomMeta: room not found');

      const room = doc.rooms[index] as Record<string, unknown>;
      Object.entries(props).forEach(([key, value]) => {
        room[key] = value;
      });
      this._proxy.rooms = doc.rooms;
    });
  }

  handleMetaDocChange(
    events: YEvent<YArray<unknown> | YText | YMap<unknown>>[],
  ) {
    events.forEach((e) => {
      const hasKey = (k: string) =>
        e.target === this._yMap && e.changes.keys.has(k);

      if (
        e.target === this.yRooms ||
        e.target.parent === this.yRooms ||
        hasKey('rooms')
      ) {
        this._handleRomMetaEvent();
      }

      if (hasKey('name') || hasKey('avatar')) {
        this._handleCommonFieldsEvent();
      }
    });
  }
}
