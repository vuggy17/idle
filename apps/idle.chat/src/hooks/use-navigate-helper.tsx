import { ID } from '@idle/model';
import { useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Routes } from '../router/routes';

export default function useNavigateHelper() {
  const navigate = useNavigate();
  const jumpToRoom = useCallback(
    (workspaceId: ID, roomId: ID) => {
      navigate(`/${Routes.workspace}/${workspaceId}/${roomId}`);
    },
    [navigate],
  );

  const jumpToWorkspace = useCallback(
    (workspaceId: ID) => {
      navigate(`/${Routes.workspace}/${workspaceId}`);
    },
    [navigate],
  );
  return useMemo(
    () => ({
      jumpToRoom,
      jumpToWorkspace,
    }),
    [jumpToRoom, jumpToWorkspace],
  );
}
