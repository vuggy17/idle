import { useCallback, useMemo } from 'react';
import { ID } from '@idle/model';
import { IdleWorkspace } from '../utils/workspace-state';
import useIdleWorkspaceHelper from './use-idle-workspace-helper';
import useNavigateHelper from './use-navigate-helper';
import { User } from '../features/auth/entities/user';
import { assertExists } from '../utils/assert';
import { RoomMeta } from '../utils/workspace-state/meta';

export default function useRoomHelper(workspace: IdleWorkspace) {
  const { jumpToRoom } = useNavigateHelper();
  const { createGroupRoom } = useIdleWorkspaceHelper(workspace);

  const createRoomAndOpen = useCallback(
    (members: User[], avatar: string) => {
      const room = createGroupRoom(members, 'Untitled group', avatar);
      jumpToRoom(workspace.id, room.id);
    },
    [createGroupRoom, jumpToRoom, workspace.id],
  );

  const addMember = useCallback(
    (roomId: ID, newMembers: User[]) => {
      if (newMembers.length === 0) return;

      const room = workspace.getRoom(roomId);
      assertExists(room);
      const { meta } = room;
      assertExists(meta);
      // remove members which is already included in group
      // const filteredMembers = newMembers.filter((new) =>
      // meta.members.findIndex((old) => old.id === new.id)
      // );
      const filteredMembers = newMembers.filter((newMember) =>
        meta.members.findIndex((old) => old.id === newMember.id),
      );

      const updatedMeta: RoomMeta = {
        ...meta,
        members: meta.members.concat(filteredMembers),
      };
      workspace.setRoomMeta(roomId, updatedMeta);
    },
    [workspace],
  );
  return useMemo(
    () => ({
      createRoomAndOpen,
      addMember,
    }),
    [createRoomAndOpen, addMember],
  );
}
