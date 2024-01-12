import { ID } from '@idle/model';
import { Subject } from 'rxjs';
import { Binder } from 'immer-yjs/src';
import { Array as YArray, Map as YMap, Text as YText, YEvent } from 'yjs';
import IdleDoc from './doc';

const RoomVariants = {
  private: 'private',
} as const;
export type RoomType = keyof typeof RoomVariants;

export interface RoomMeta {
  id: ID;
  title: string;
  createDate: number;
  members: ID[];
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

  roomMetaAdded = new Subject<ID>();

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
    const { roomMetas: pageMetas, _prevRooms } = this;

    pageMetas.forEach((pageMeta) => {
      if (!_prevRooms.has(pageMeta.id)) {
        this.roomMetaAdded.next(pageMeta.id);
      }
    });

    _prevRooms.forEach((prevPageId) => {
      const isRemoved = !pageMetas.find((p) => p.id === prevPageId);
      if (isRemoved) {
        this.roomMetaRemoved.next(prevPageId);
      }
    });

    _prevRooms.clear();
    pageMetas.forEach((page) => _prevRooms.add(page.id));

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

    this.binder.update((metadata) => {
      if (index === undefined) {
        metadata.rooms.push(room);
      } else {
        metadata.rooms.splice(index, 0, room);
      }
    });
  }

  removeRoomMeta(roomId: ID) {
    if (!this.rooms) throw new Error('No rooms existed to delete');

    const index = this.roomMetas.findIndex((room) => room.id === roomId);
    if (index < 0) return;

    this.binder.update((metadata) => {
      metadata.rooms.splice(index, 1);
    });
  }

  /**
   * @internal Use {@link Workspace.setRoomMeta} instead
   */
  setRoomMeta(id: string, props: Partial<RoomMeta>) {
    const rooms = (this.rooms as RoomMeta[]) ?? [];
    const index = rooms.findIndex((page: RoomMeta) => id === page.id);

    if (!this.rooms) {
      this._proxy.rooms = [];
    }
    if (index === -1) return;
    if (!this.rooms) throw new Error('setRoomMeta: room not found');

    const page = this.rooms[index] as Record<string, unknown>;
    Object.entries(props).forEach(([key, value]) => {
      page[key] = value;
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
