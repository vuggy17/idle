import { ConfigProvider, Flex, Input, List, Typography } from 'antd';
import { useRef } from 'react';
import { RoomMetaRender } from './RoomItem';
import useConversationItemStyle from './useConversationItemStyle';
import { RoomMeta } from '../../../../utils/workspaceState/meta';

export default function RoomList({ rooms }: { rooms: RoomMeta[] }) {
  const sidebarRef = useRef<HTMLDivElement>(null);

  const hideScrollbar = () => {
    if (!sidebarRef.current) return;
    sidebarRef.current.style.overflowY = 'auto';
  };

  const displayScrollbar = () => {
    if (!sidebarRef.current) return;
    sidebarRef.current.style.overflowY = 'hidden';
  };

  const { styles, cx } = useConversationItemStyle();

  return (
    <div
      ref={sidebarRef}
      className="overflow-y-auto h-full"
      onMouseEnter={hideScrollbar}
      onMouseLeave={displayScrollbar}
    >
      <ConfigProvider
        list={{
          className: cx(styles.list, styles.listActive),
        }}
      >
        <List
          header={
            <div className="px-3">
              <Flex align="center" justify="space-between">
                <Typography.Title level={3}>Messages</Typography.Title>
              </Flex>
              <Input placeholder="Search" />
            </div>
          }
          className="overflow-hidden"
          dataSource={rooms}
          renderItem={(metadata) => (
            <RoomMetaRender key={metadata.id} meta={metadata} />
          )}
        />
      </ConfigProvider>
    </div>
  );
}
