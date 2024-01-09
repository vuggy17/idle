import { ID } from '@idle/model';
import * as Y from 'yjs';
import { Subject } from 'rxjs';
import { JSONObject, UpdateFn } from 'immer-yjs/src';
import IdleDoc from './doc';

export default class RoomDoc<State extends JSONObject = Record<string, any>> {
  readonly id: ID;

  readonly rootDoc: IdleDoc;

  protected readonly _yRoomDoc: Y.Doc;

  protected readonly _yMessages: Y.Array<State>;

  private _loaded!: boolean;

  private _onLoad = new Subject<void>();

  constructor(id: ID, rootDoc: IdleDoc) {
    this.id = id;
    this.rootDoc = rootDoc;

    this._yRoomDoc = this._initSubDoc();
    this._yMessages = this._yRoomDoc.getArray('messages');
  }

  get yMessages() {
    return this._yMessages;
  }

  get loaded() {
    return this._loaded;
  }

  get spaceDoc() {
    return this._yRoomDoc;
  }

  async load() {
    if (this.loaded) {
      return this;
    }

    const promise = new Promise((resolve) => {
      this._onLoad.subscribe(() => {
        resolve(undefined);
      });
    });

    this._yRoomDoc.load();

    await promise;

    return this;
  }

  private _initSubDoc = () => {
    let subDoc = this.rootDoc.rooms.get(this.id);
    if (!subDoc) {
      subDoc = new Y.Doc({
        guid: this.id,
      });
      this.rootDoc.rooms.set(this.id, subDoc);
      this._loaded = true;
      this._onLoad.next();
    } else {
      this._loaded = false;
      this.rootDoc.on('subdocs', this._onSubdocEvent);
    }

    return subDoc;
  };

  private _onSubdocEvent = ({ loaded }: { loaded: Set<Y.Doc> }): void => {
    const result = Array.from(loaded).find(
      (doc) => doc.guid === this._yRoomDoc.guid,
    );
    if (!result) {
      return;
    }
    this.rootDoc.off('subdocs', this._onSubdocEvent);
    this._loaded = true;
    this._onLoad.next();
  };

  update(fn: UpdateFn<State>) {
    console.log(this);
    throw new Error('not implemented yet');
  }
}
