import { ID } from '@idle/model';
import { IdleWorkspace } from '../utils/workspaceState';

export default function useRoom(workspace: IdleWorkspace, roomID: ID) {
  const room = workspace.getRoom(roomID)?.load();
}
