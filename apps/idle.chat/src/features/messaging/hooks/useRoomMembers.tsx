import { ID } from '@idle/model';
import { IdleWorkspace } from 'apps/idle.chat/src/utils/workspace-state';
import useRoomMetas from 'apps/idle.chat/src/hooks/use-room-meta';
import { useSuspenseQuery } from '@tanstack/react-query';
import HttpProvider from 'apps/idle.chat/src/providers/http';

function useRoomMeta(workspace: IdleWorkspace, roomId: ID) {
  const list = useRoomMetas(workspace);
  const meta = list.find((meta) => meta.id === roomId);
  if (!meta) throw new Error('room not found on current workspace');
  return meta;
}

// export default function useRoomMembers(workspace: IdleWorkspace, roomId: ID) {
//   const meta = useRoomMeta(workspace, roomId);
//   const { members } = meta;
//   // call api to get user information if not found on map
//   // im going to use react query for api fetching

//   // users information
// }

/**
 * get room members without self
 * @param workspace
 * @param roomId
 * @returns
 */
export function useRoomMembers(workspace: IdleWorkspace, roomId: ID) {
  const meta = useRoomMeta(workspace, roomId);
  const { members } = meta;

  // Return the user information from the queries
  return useSuspenseQuery({
    queryKey: ['room-members', workspace.id, roomId],
    queryFn: () =>
      HttpProvider.getUserInformation({ ids: members.map((m) => m.id) }),
  });
}
