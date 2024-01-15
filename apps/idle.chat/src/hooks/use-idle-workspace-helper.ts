import { useMemo } from 'react';
import { ID } from '@idle/model';
import { IdleWorkspace } from '../utils/workspace-state';
import Room from '../utils/workspace-state/room';

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
