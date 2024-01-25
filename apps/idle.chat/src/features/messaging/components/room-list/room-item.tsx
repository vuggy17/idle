import { Flex, List, Typography } from 'antd';
import { useAtom, useAtomValue } from 'jotai';
import { waitForCurrentWorkspaceAtom } from 'apps/idle.chat/src/utils/workspace/atom';
import { currentRoomIdAtom } from '../../../../store/room';
import useNavigateHelper from '../../../../hooks/use-navigate-helper';
import PartialAvatar from '../../../../components/user-card/partial-avatar';
import { RoomMeta } from '../../../../utils/workspace-state/meta';

export type RoomItem = {
  id: string;
  name: string;
  sub: string;
  img: string;
  lastUpdatedAt: number;
};

export function RoomMetaRender({ meta }: { meta: RoomMeta }) {
  const [currentRoom, setCurrentRoom] = useAtom(currentRoomIdAtom);
  const workspace = useAtomValue(waitForCurrentWorkspaceAtom);
  const { jumpToRoom } = useNavigateHelper();

  const { createDate, id, title } = meta;
  const sub = title;
  const lastUpdatedAt = createDate;
  const img = '';

  const onRoomClick = () => {
    setCurrentRoom(meta.id);
    jumpToRoom(workspace.id, meta.id);
  };

  const isSelected = currentRoom === meta.id;
  return (
    <List.Item
      className={`min-w-0 ${isSelected ? 'active' : ''}`}
      onClick={onRoomClick}
    >
      <RoomItemInner
        img={img}
        title={title}
        lastUpdatedAt={lastUpdatedAt}
        sub={title}
      />
    </List.Item>
  );
}

export function RoomItemInner({
  img,
  title,
  lastUpdatedAt,
  sub,
}: {
  img: string;
  title: string;
  lastUpdatedAt: number;
  sub: string;
}) {
  return (
    <Flex align="center" className="min-w-0 px-4">
      <PartialAvatar src={img} alt={title} className="shrink-0 mr-2" />
      <div className="flex-1 basis-0 min-w-0">
        <div className="flex">
          <Typography.Text ellipsis className="inline">
            {title}
          </Typography.Text>
          <Typography.Text type="secondary" className="text-xs inline">
            {lastUpdatedAt}
          </Typography.Text>
        </div>
        <Typography.Text type="secondary" ellipsis>
          {sub}
        </Typography.Text>
      </div>
    </Flex>
  );
}
