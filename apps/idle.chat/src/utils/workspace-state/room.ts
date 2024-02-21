import { ID } from '@idle/model';
import * as Y from 'yjs';
import cuid2 from '@paralleldrive/cuid2';
import { Subject } from 'rxjs';
// eslint-disable-next-line import/no-cycle
import Workspace from './workspace';
import RoomDoc from './room-doc';
import IdleDoc from './doc';
import { RoomMeta } from './meta';
// eslint-disable-next-line import/no-cycle
import { MessageList } from './message/message-list';
import { YMessage } from './message/message';

export type RoomOptions = {
  id: ID;
  workspace: Workspace;
  doc: IdleDoc;
  meta: RoomMeta;
  idGenerator?: () => string;
};

type FlatMessageMap = Record<string, YMessage>;
/** JSON-serializable properties of a block */
export type MessageSysProps = {
  id: string;
};
export type MessageProps = MessageSysProps & {
  [index: string]: unknown;
};

export default class Room extends RoomDoc<FlatMessageMap> {
  private readonly _workspace: Workspace;

  private readonly _messageList: MessageList;

  readonly id: ID;

  private readonly _idGenerator: () => string;

  readonly events = {
    ready: new Subject<void>(),
    messageUpdated: new Subject<{
      type: 'add';
      id: string;
    }>(),
  };

  private _ready = false;

  constructor({
    id,
    workspace,
    doc,
    idGenerator = cuid2.createId,
  }: RoomOptions) {
    super(id, doc);
    this.id = id;
    this._workspace = workspace;
    this._idGenerator = idGenerator;

    this._messageList = new MessageList(this._yMessages);

    this.events.ready.subscribe(() => console.log('room ready'));
  }

  get ready() {
    return this._ready;
  }

  get workspace() {
    return this._workspace;
  }

  get meta() {
    return this.workspace.meta.getRoomMeta(this.id);
  }

  get messages() {
    return this._messageList.messages;
  }

  addMessages(
    messages: Array<{
      props?: Partial<MessageProps & Omit<MessageProps, 'id'>>;
    }>,
  ) {
    const ids: string[] = [];
    messages.forEach((msg) => {
      const id = this.addMessage(msg.props ?? {});
      ids.push(id);
    });

    return ids;
  }

  addMessage(messageProps: Partial<MessageProps>) {
    const id = messageProps.id ?? this._idGenerator();
    this.transact(() => {
      this._messageList.addMessage(id, { ...messageProps });
    });

    return id;
  }

  private _getYMessage(id: ID): YMessage | null {
    const yMessage = this._yMessages.get(id);
    if (!yMessage) return null;

    return yMessage;
  }

  private _handleYMessageAdd(id: ID) {
    const yMessage = this._getYMessage(id);
    if (!yMessage) {
      console.warn(
        `Failed to handle yBlock add, yBlock with id-${id} not found`,
      );
      return;
    }
    this._messageList.onMessageAdded(id, this);

    this.events.messageUpdated.next({ type: 'add', id });
  }

  private _handleYEvent(event: Y.YEvent<YMessage | Y.Text | Y.Array<unknown>>) {
    // event on top-level block store
    if (event.target === this._yMessages) {
      event.keys.forEach((value, id) => {
        if (value.action === 'add') {
          this._handleYMessageAdd(id);
        } else if (value.action === 'delete') {
          // console.warn('delete action on top-level block store', event);
        } else {
          // fires when undoing delete-and-add operation on a block
          // console.warn('update action on top-level block store', event);
        }
      });
    }
  }

  private _handleYEvents = (events: Y.YEvent<YMessage | Y.Text>[]) => {
    for (const event of events) {
      this._handleYEvent(event);
    }
  };

  override load(initFn?: () => Promise<void> | void) {
    if (this.ready) {
      return this;
    }
    console.log('room load called');
    super.load();

    // console.log('load', this._yMessages.toJSON());

    this._initYMessages();

    this._yMessages.forEach((_, id) => {
      this._handleYMessageAdd(id);
    });

    if (initFn) {
      initFn();
    }

    this._ready = true;
    this.events.ready.next();

    return this;
  }

  dispose() {
    console.log('room disposing');
    // throw new Error('Method not implemented.');

    this.events.messageUpdated.unsubscribe();

    if (this.ready) {
      this._yMessages.unobserveDeep(this._handleYEvents);
      this._yMessages.clear();
    }
  }

  private _initYMessages() {
    // console.log('init y message', this._yMessages.toJSON());
    this._yMessages.observeDeep(this._handleYEvents);
  }
}
