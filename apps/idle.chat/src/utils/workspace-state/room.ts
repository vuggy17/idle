import { ID } from '@idle/model';
// eslint-disable-next-line import/no-cycle
import Workspace from './workspace';
import RoomDoc from './room-doc';
import IdleDoc from './doc';
import { RoomMeta } from './meta';

export type RoomOptions = {
  id: ID;
  workspace: Workspace;
  doc: IdleDoc;
  meta: RoomMeta;
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
