import { ID } from '@idle/model';
import { IdleWorkspace } from 'apps/idle.chat/src/utils/workspace-state';
import MessageList from './message-list/message-list';
import MessageInput from './message-input';
import { Flex } from 'antd';
import { useWorkspaceRoom } from 'apps/idle.chat/src/hooks/use-workspace-room';

export default function RoomDetail({
  workspace,
  roomId,
}: {
  workspace: IdleWorkspace;
  roomId: ID;
}) {
  const room = useWorkspaceRoom(workspace, roomId);
  if (!room) return null;

  return (
    <Flex vertical className="h-full">
      <section className="flex-1 overflow-auto">
        <MessageList messages={room.messages} />
      </section>
      <div className="px-4 mb-6">
        <MessageInput placeholder={`Message #${room.meta?.title}`} />
      </div>
    </Flex>
  );
}
