import { useCallback, useMemo } from 'react';
import { ID } from '@idle/model';
import { IdleWorkspace } from '../utils/workspaceState';
import useIdleWorkspaceHelper from './useIdleWorkspaceHelper';
import useNavigateHelper from './useNavigateHelper';

export default function useRoomHelper(workspace: IdleWorkspace) {
  const { jumpToRoom } = useNavigateHelper();
  const { createRoom } = useIdleWorkspaceHelper(workspace);

  const createRoomAndOpen = useCallback(
    (memberIds: ID[], roomId?: ID) => {
      const room = createRoom(memberIds, roomId);
      jumpToRoom(workspace.id, room.id);
    },
    [createRoom, jumpToRoom, workspace.id],
  );

  const loadRoom = useCallback(
    async (roomId: ID) => {
      await workspace.getRoom(roomId)?.load();
    },
    [workspace],
  );

  return useMemo(
    () => ({
      createRoomAndOpen,
    }),
    [createRoomAndOpen],
  );
}
