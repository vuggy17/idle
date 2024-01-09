import { ID } from '@idle/model';
import { ConfigProvider, Flex, Input, List, Typography } from 'antd';
import { useRef } from 'react';
import { useAtomValue } from 'jotai';
import useRoomMetas from '../../../../hooks/useRoomMeta';
import uniqueId from '../../../../utils/uniqueId';
import {
  currentWorkspaceAtom,
  waitForCurrentWorkspaceAtom,
} from '../../../../utils/workspace/atom';
import { RoomItem, RoomMetaRender } from './RoomItem';
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

const ContainerHeight = 400;

export default function ChatSideBar({
  activeConversation,
  onItemClick,
}: {
  activeConversation: ID;
  onItemClick: (item: RoomItem) => void;
}) {
  const workspace = useAtomValue(currentWorkspaceAtom);
  const currentWorkspace = useAtomValue(waitForCurrentWorkspaceAtom);
  const roomMetaList = useRoomMetas(currentWorkspace.idleWorkSpace);
  // console.log("🚀 ~ file: index.tsx:50 ~ roomMetaList:", roomMetaList)

  const sidebarRef = useRef<HTMLDivElement>(null);

  const onScroll = (e: React.UIEvent<HTMLElement, UIEvent>) => {
    // if (
    //   e.currentTarget.scrollHeight - e.currentTarget.scrollTop ===
    //   ContainerHeight
    // ) {
    // }
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
          dataSource={roomMetaList}
          renderItem={(metadata) => (
            <div
              // onClick={() => onItemClick(room)}
              role="menuitem"
              tabIndex={0}
              // onKeyDown={(e) => {
              //   if (e.key === 'enter') {
              //     onItemClick(room);
              //   }
              // }}
            >
              <RoomMetaRender key={metadata.id} meta={metadata} />
            </div>
          )}
        />
      </ConfigProvider>
    </div>
  );
}
