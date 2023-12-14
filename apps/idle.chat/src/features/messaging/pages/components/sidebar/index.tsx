import { ID } from '@idle/model';
import { ConfigProvider, Flex, Input, List, Typography } from 'antd';
import { useRef, useState } from 'react';
import ConversationItem from './ConversationItem';
import uniqueId from '../../../../../utils/uniqueId';
import useConversationItemStyle from './useConversationItemStyle';

const rooms = [
  {
    id: '-1',
    name: `room ${-1} with long long long long long content`,
    sub: `room ${-1} sub`,
    img: 'room image',
    lastUpdatedAt: 2,
  },
  ...new Array(40).fill({}).map((_, i) => ({
    id: uniqueId(),
    name: `room ${i} with long long long long long content`,
    sub: `room ${i} sub`,
    img: 'room image',
    lastUpdatedAt: 2,
  })),
];

type RoomItem = {
  id: string;
  name: string;
  sub: string;
  img: string;
  lastUpdatedAt: number;
};

const ContainerHeight = 400;

export default function ChatSideBar({
  activeConversation,
  onItemClick,
}: {
  activeConversation: ID;
  onItemClick: (item: RoomItem) => void;
}) {
  const [data, setData] = useState(rooms);
  const sidebarRef = useRef<HTMLDivElement>(null);

  const appendData = () => {
    setData((prev) => [
      ...prev,
      ...new Array(4).fill({}).map((_, i) => ({
        id: uniqueId(),
        name: `room ${i} with long long long long long content`,
        sub: `room ${i} sub`,
        img: 'room image',
        lastUpdatedAt: 2,
      })),
    ]);
  };

  const onScroll = (e: React.UIEvent<HTMLElement, UIEvent>) => {
    if (
      e.currentTarget.scrollHeight - e.currentTarget.scrollTop ===
      ContainerHeight
    ) {
      appendData();
    }
  };

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
                <Typography.Title level={3}>Chat</Typography.Title>
              </Flex>
              <Input placeholder="Search" />
            </div>
          }
          className="overflow-hidden"
          dataSource={data}
          renderItem={(room) => (
            <div
              onClick={() => onItemClick(room)}
              role="menuitem"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'enter') {
                  onItemClick(room);
                }
              }}
            >
              <ConversationItem
                key={room.id}
                title={room.name}
                sub={room.sub}
                img={room.img}
                lastUpdatedAt={room.lastUpdatedAt}
                isActive={activeConversation === room.id}
              />
            </div>
          )}
        />
      </ConfigProvider>
    </div>
  );
}
