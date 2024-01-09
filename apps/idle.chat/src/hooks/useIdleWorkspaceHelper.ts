import { useMemo } from 'react';
import { ID } from '@idle/model';
import { IdleWorkspace } from '../utils/workspaceState';
import Room from '../utils/workspaceState/room';

export default function useIdleWorkspaceHelper(workspace: IdleWorkspace) {
  return useMemo(
    () => ({
      createRoom: (memberIds: ID[], roomId?: ID): Room => {
        return workspace.createRoom({ id: roomId, members: memberIds });
      },
    }),
    [workspace],
  );
}
