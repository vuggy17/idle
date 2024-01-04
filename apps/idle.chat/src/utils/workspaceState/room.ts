import { ID } from '@idle/model';
import { Doc } from 'yjs';
import Message from '../workspace/message';
// eslint-disable-next-line import/no-cycle
import Workspace from './workspace';

type RoomMeta = {
  id: ID;
  name: string;
  avatar?: string;
};

export type RoomOptions = {
  id: ID;
  workspace: Workspace;
  doc: Doc;
};

export default class Room {
  private readonly rootDoc: Doc;

  messages:

  private readonly workspace: Workspace;

  readonly id: ID;

  constructor(options: RoomOptions) {
    const { id, workspace, doc } = options;
    this.id = id;
    this.workspace = workspace;
    this.rootDoc = doc;
  }

  async load() {
    return this;
  }
}
