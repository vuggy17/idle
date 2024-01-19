import { useCallback, useMemo } from 'react';
import { IdleWorkspace } from '../utils/workspace-state';
import useIdleWorkspaceHelper from './use-idle-workspace-helper';
import useNavigateHelper from './use-navigate-helper';
import { User } from '../features/auth/entities/user';

export default function useRoomHelper(workspace: IdleWorkspace) {
  const { jumpToRoom } = useNavigateHelper();
  const { createPrivateRoom } = useIdleWorkspaceHelper(workspace);

  const createRoomAndOpen = useCallback(
    (members: User[], target: User) => {
      const room = createPrivateRoom(members, target.name, target.avatar);
      jumpToRoom(workspace.id, room.id);
    },
    [createPrivateRoom, jumpToRoom, workspace.id],
  );

  return useMemo(
    () => ({
      createRoomAndOpen,
    }),
    [createRoomAndOpen],
  );
}
