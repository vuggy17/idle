// eslint-disable-next-line @nx/enforce-module-boundaries
import PartialAvatar from '@chat/components/user-card/partial-avatar';
import { Flex, Space, Typography, Avatar, theme, FlexProps } from 'antd';
import { SidebarExpand } from 'iconoir-react';
import { useRef } from 'react';
import Room from '../../../../utils/workspace-state/room';
import { RoomSetting, RoomSettingRef } from '../room-setting';
import { assertExists } from 'apps/idle.chat/src/utils/assert';

const { useToken } = theme;

function HeaderButton({ children, ...rest }: FlexProps) {
  const { token } = useToken();

  return (
    <Flex
      role="button"
      style={{
        borderRadius: token.borderRadiusLG,
        border: `1px solid ${token.colorBorderSecondary}`,
      }}
      align="center"
      className="p-px cursor-pointer border-solid border group hover:!border-gray-300 duration-150"
      {...rest}
    >
      {children}
    </Flex>
  );
}

export default function RoomDetailHeader({ room }: { room: Room }) {
  const roomSettingRef = useRef<RoomSettingRef>(null);
  const roomMeta = room.meta;
  assertExists(roomMeta);
  const { members, avatar, title } = roomMeta;

  return (
    <Flex
      justify="space-between"
      align="center"
      className="bg-white ml-px pl-6 pr-4"
    >
      <Space>
        <PartialAvatar src={avatar} alt={title} size="large" />
        <div>
          <Typography.Text>{room.meta?.title}</Typography.Text>
        </div>
      </Space>
      <Space>
        <HeaderButton>
          <Avatar.Group>
            {members.map(({ avatar, name }, index) => (
              <PartialAvatar
                key={`avatar${avatar}${Math.random()}`}
                src={avatar}
                alt={name}
              />
            ))}
          </Avatar.Group>
          <Typography.Text
            strong
            type="secondary"
            className="align-middle ml-1 mr-3 group-hover:text-gray-800"
          >
            {members.length}
          </Typography.Text>
        </HeaderButton>
        <HeaderButton onClick={() => roomSettingRef.current?.open()}>
          <SidebarExpand
            className="text-sm duration-200 h-9 mx-2 rotate-180"
            strokeWidth="inherit"
          />
        </HeaderButton>
      </Space>
      <RoomSetting ref={roomSettingRef} name={title} roomId={room.id} />
    </Flex>
  );
}
