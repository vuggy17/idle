import { ID } from '@idle/model';
import workspaceManager from '../utils/workspace';
import WorkspaceFlavour from '../utils/workspace/list/workspaceFlavour';

const UNTITLED_WORKSPACE = 'Untitled workspace';

export default async function createFirstAppData(): Promise<null | ID> {
  if (localStorage.getItem('is-first-open')) {
    return null;
  }

  localStorage.setItem('is-first-open', 'false');
  const workspaceId = await workspaceManager.createWorkspace(
    WorkspaceFlavour.LOCAL,
    async (workspace) => {
      workspace.meta.setName(UNTITLED_WORKSPACE);

      const room = workspace.createRoom({});
      workspace.setRoomMeta(room.id, {});

      console.debug('create first workspace');
    },
  );
  console.info('create first workspace', workspaceId);
  return workspaceId;
}
