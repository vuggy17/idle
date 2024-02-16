import { ConfigProvider, Flex, List, Typography } from 'antd';
import { useRef } from 'react';
import { RoomMetaRender } from './room-item';
import useSelectableListStyle from './use-conversation-item-style';
import { RoomMeta } from '../../../../utils/workspace-state/meta';

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

  const { styles, cx } = useSelectableListStyle();

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
            <div className="px-6 pt-3">
              <Flex align="center" justify="space-between" className="mb-0">
                <Typography.Title
                  level={4}
                  className="mt-0"
                  style={{ marginBottom: 0 }}
                >
                  Messages
                </Typography.Title>
              </Flex>
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
