import { useMemo } from 'react';
import { IdleWorkspace } from '../utils/workspace-state';
import { User } from '../features/auth/entities/user';

export default function useIdleWorkspaceHelper(workspace: IdleWorkspace) {
  return useMemo(
    () => ({
      createPrivateRoom(members: User[], title: string, avatar?: string) {
        return workspace.createRoom({
          members,
          type: 'private',
          title,
          avatar,
        });
      },
      createGroupRoom(members: User[], title: string, avatar?: string) {
        console.log('group room');
        return workspace.createRoom({
          members,
          type: 'group',
          title,
          avatar,
        });
      },
    }),
    [workspace],
  );
}
