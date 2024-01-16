import { useCallback, useMemo } from 'react';
import { ID, UserDTO } from '@idle/model';
import { IdleWorkspace } from '../utils/workspace-state';
import useIdleWorkspaceHelper from './use-idle-workspace-helper';
import useNavigateHelper from './use-navigate-helper';

export default function useRoomHelper(workspace: IdleWorkspace) {
  const { jumpToRoom } = useNavigateHelper();
  const { createPrivateRoom } = useIdleWorkspaceHelper(workspace);

  const createRoomAndOpen = useCallback(
    (memberIds: ID[], target: UserDTO) => {
      const room = createPrivateRoom(memberIds, target);
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
