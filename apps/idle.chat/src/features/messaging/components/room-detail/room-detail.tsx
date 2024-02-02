import { ID } from '@idle/model';
import { useRoom } from 'apps/idle.chat/src/hooks/use-room';
import { IdleWorkspace } from 'apps/idle.chat/src/utils/workspace-state';
import MessageList from './message-list/message-list';
import MessageInput from './message-input';
import { Flex } from 'antd';

export default function RoomDetail({
  workspace,
  roomId,
}: {
  workspace: IdleWorkspace;
  roomId: ID;
}) {
  const room = useRoom(workspace, roomId);
  if (!room) return null;
  return (
    <Flex vertical className="h-full">
      <section className="flex-1 overflow-auto">
        <MessageList />
      </section>
      <div className="px-4 mb-6">
        <MessageInput placeholder={`Message #${room.meta?.title}`} />
      </div>
    </Flex>
  );
}