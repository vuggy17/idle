import { ID } from '@idle/model';
import * as Y from 'yjs';
import { Message, YMessage } from './message';
import { native2Y } from '../utils/utils';
// eslint-disable-next-line import/no-cycle
import Room from '../room';

const messageVersion = 0.1;

export class MessageList {
  protected readonly _yMessages: Y.Map<YMessage>;

  protected readonly _messages: Array<Message> = [];

  get messages() {
    return this._messages;
  }

  constructor(messages: Y.Map<YMessage>) {
    this._yMessages = messages;
  }

  onMessageAdded(id: ID, room: Room) {
    const index = this._messages.findIndex((msg) => msg.id === id);
    if (index >= 0) {
      return;
    }
    const yMessage = this._yMessages.get(id);
    if (!yMessage) {
      console.warn(`Could not find block with id ${id}`);
      return;
    }

    const message = new Message(yMessage);
    this._messages.push(message);
  }

  addMessage(id: ID, initialProps: Record<string, unknown>) {
    const yMessage = new Y.Map();
    this._yMessages.set(id, yMessage);

    const version = messageVersion;
    yMessage.set('sys:id', id);
    yMessage.set('sys:version', version);

    Object.entries(initialProps).forEach(([key, value]) => {
      if (value === undefined) return;
      yMessage.set(`prop:${key}`, native2Y(value));
    });

    return yMessage;
  }
}
