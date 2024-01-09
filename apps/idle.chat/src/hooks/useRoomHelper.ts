import { useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ID } from '@idle/model';
import { IdleWorkspace } from '../utils/workspaceState';
import useIdleWorkspaceHelper from './useIdleWorkspaceHelper';

export default function useRoomHelper(workspace: IdleWorkspace) {
  const navigate = useNavigate();
  const { createRoom } = useIdleWorkspaceHelper(workspace);

  const createRoomAndOpen = useCallback(
    (memberIds: ID[], roomId?: ID) => {
      const room = createRoom(memberIds, roomId);
      navigate(room.id);
    },
    [createRoom, navigate],
  );

  return useMemo(
    () => ({
      createRoomAndOpen,
    }),
    [createRoomAndOpen],
  );
}
