import { useMemo } from 'react';
import { ID, UserDTO } from '@idle/model';
import { IdleWorkspace } from '../utils/workspace-state';

export default function useIdleWorkspaceHelper(workspace: IdleWorkspace) {
  return useMemo(
    () => ({
      createPrivateRoom(memberIds: ID[], target: UserDTO) {
        return workspace.createRoom({
          members: memberIds,
          type: 'private',
          title: target.name,
        });
      },
    }),
    [workspace],
  );
}
