import { ConfigProvider, Flex, Input, List, Typography } from 'antd';
import { useRef } from 'react';
import { RoomMetaRender } from './room-item';
import useConversationItemStyle from './use-conversation-item-style';
import { RoomMeta } from '../../../../utils/workspace-state/meta';
import { useAtomValue } from 'jotai';
import { waitForCurrentWorkspaceAtom } from 'apps/idle.chat/src/utils/workspace/atom';

export default function RoomList({ rooms }: { rooms: RoomMeta[] }) {
  const sidebarRef = useRef<HTMLDivElement>(null);
  const workspace = useAtomValue(waitForCurrentWorkspaceAtom);

  const hideScrollbar = () => {
    if (!sidebarRef.current) return;
    sidebarRef.current.style.overflowY = 'auto';
  };

  const displayScrollbar = () => {
    if (!sidebarRef.current) return;
    sidebarRef.current.style.overflowY = 'hidden';
  };

  const searchWorkspace = (query: string) => {
    console.log('🚀 ~ searchWorkspace ~ query:', query);
    const value = workspace.state.indexer.search.search(query);
    console.log('🚀 ~ searchWorkspace ~ value:', value);
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
              <Input
                placeholder="Search"
                onChange={(e) => {
                  searchWorkspace(e.target.value);
                }}
              />
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
