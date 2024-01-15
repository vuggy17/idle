import {
  Avatar,
  Flex,
  FlexProps,
  Layout,
  Space,
  Typography,
  theme,
} from 'antd';
import PartialAvatar from '@chat/components/user-card/partial-avatar';
import { SidebarExpand } from 'iconoir-react';
import { useRef } from 'react';
import { useParams } from 'react-router-dom';
import { RoomLayout } from './room-layout';
import { RoomSetting, RoomSettingRef } from '../components/room-setting';

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

export function Component() {
  const avatars = ['https://placehold.co/400', 'https://placehold.co/400'];
  const roomSettingRef = useRef<RoomSettingRef>(null);
  const roomName = 'haha';
  const { roomId } = useParams();

  return (
    <RoomLayout>
      <Layout>
        <Layout.Header className="bg-transparent px-0">
          <Flex
            justify="space-between"
            align="center"
            className="bg-white ml-px pl-6 pr-4"
          >
            <Space>
              <PartialAvatar
                src="https://placehold.co/400"
                alt="haha"
                size="large"
              />
              <div>
                <Typography.Text>{roomName}</Typography.Text>
              </div>
            </Space>

            <Space>
              <HeaderButton>
                <Avatar.Group>
                  {avatars.map((url) => (
                    <PartialAvatar src={url} alt="haha" />
                  ))}
                </Avatar.Group>
                <Typography.Text
                  strong
                  type="secondary"
                  className="align-middle ml-1 mr-3 group-hover:text-gray-800"
                >
                  {avatars.length}
                </Typography.Text>
              </HeaderButton>

              {/* <HeaderButton>
                <Tooltip title="Delete chat">
                  <Trash
                    className="text-sm duration-200 h-9 mx-2 "
                    strokeWidth="inherit"
                  />
                </Tooltip>
              </HeaderButton> */}

              <HeaderButton onClick={() => roomSettingRef.current?.open()}>
                <SidebarExpand
                  className="text-sm duration-200 h-9 mx-2 rotate-180"
                  strokeWidth="inherit"
                />
              </HeaderButton>
            </Space>
          </Flex>
        </Layout.Header>
      </Layout>

      <RoomSetting ref={roomSettingRef} name={roomName} roomId={roomId!} />
    </RoomLayout>
  );
}

Component.displayName = 'RoomDetail';
