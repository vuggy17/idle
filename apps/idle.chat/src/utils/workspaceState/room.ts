import { ID, TIME } from '@idle/model';
import { Doc } from 'yjs';
import Message from '../workspace/message';
// eslint-disable-next-line import/no-cycle
import Workspace from './workspace';
import RoomDoc from './roomDoc';
import IdleDoc from './doc';

type RoomMeta = {
  id: ID;
  name: string;
  avatar?: string;
};

export type RoomOptions = {
  id: ID;
  workspace: Workspace;
  doc: IdleDoc;
};

export default class Room extends RoomDoc {
  private readonly workspace: Workspace;

  readonly id: ID;

  constructor(options: RoomOptions) {
    const { id, workspace, doc } = options;
    super(id, doc);
    this.id = id;
    this.workspace = workspace;
  }

  get meta() {
    return this.workspace.meta.getRoomMeta(this.id);
  }

  dispose() {
    console.log('room disposing');
    // throw new Error('Method not implemented.');
  }
}
