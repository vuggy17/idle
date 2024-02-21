import { ID } from '@idle/model';
import { DocumentWorkspace } from 'apps/idle.chat/src/utils/workspace-state';
import MessageList from './message-list/message-list';
import MessageInput from './message-input';
import { Flex } from 'antd';
import { useWorkspaceRoom } from 'apps/idle.chat/src/hooks/use-workspace-room';

export default function RoomDetail({
  workspace,
  roomId,
}: {
  workspace: DocumentWorkspace;
  roomId: ID;
}) {
  const room = useWorkspaceRoom(workspace, roomId);
  if (!room) return null;

  return (
    <Flex vertical className="h-full">
      <section className="flex-1 overflow-auto">
        <MessageList room={room} />
      </section>
      <div className="px-4 mb-6">
        <MessageInput placeholder={`Message #${room.meta?.title}`} />
      </div>
    </Flex>
  );
}
