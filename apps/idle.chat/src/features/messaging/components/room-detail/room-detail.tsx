import { ID } from '@idle/model';
import { useRoom } from 'apps/idle.chat/src/hooks/use-room';
import { IdleWorkspace } from 'apps/idle.chat/src/utils/workspace-state';

export default function RoomDetail({
  workspace,
  roomId,
}: {
  workspace: IdleWorkspace;
  roomId: ID;
}) {
  const room = useRoom(workspace, roomId);
  if (!room) return null;
  return <div>room-detail</div>;
}
