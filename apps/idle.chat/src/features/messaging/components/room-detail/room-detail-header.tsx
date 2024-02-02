// eslint-disable-next-line @nx/enforce-module-boundaries
import PartialAvatar from '@chat/components/user-card/partial-avatar';
import {
  Flex,
  Space,
  Typography,
  Avatar,
  theme,
  FlexProps,
  Popover,
  Layout,
  List,
  ConfigProvider,
  Button,
  Modal,
  ModalProps,
  Input,
  Divider,
} from 'antd';
import { SidebarExpand, UserPlus } from 'iconoir-react';
import { useRef, useState } from 'react';
import { assertExists } from 'apps/idle.chat/src/utils/assert';
import { useAtomValue } from 'jotai';
import { currentUserAtom } from 'apps/idle.chat/src/store/user';
import { DebounceSelect } from '@chat/components/debounce-select';
import HttpProvider from 'apps/idle.chat/src/providers/http';
import { ID } from '@idle/model';
import { waitForCurrentWorkspaceAtom } from 'apps/idle.chat/src/utils/workspace/atom';
import useRoomHelper from 'apps/idle.chat/src/hooks/use-room-helper';
import Room from '../../../../utils/workspace-state/room';
import { RoomSetting, RoomSettingRef } from '../room-setting';
import useSelectableListStyle from '../room-list/use-conversation-item-style';
import { User } from '../../../auth/entities/user';
import PeoplePicker from '../people-picker';

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
  const { token } = useToken();
  const roomSettingRef = useRef<RoomSettingRef>(null);
  const roomMeta = room.meta;
  assertExists(roomMeta);
  const { members, avatar, title } = roomMeta;
  const [open, setOpen] = useState(false);
  const [popOverOpen, setPopOverOpen] = useState(false);

  return (
    <ConfigProvider
      theme={{
        components: {
          Layout: {
            colorBgLayout: token.colorBgContainer,
          },
        },
      }}
    >
      <Layout>
        <Flex
          justify="space-between"
          align="center"
          className="ml-px pl-6 pr-4"
        >
          <Space>
            <PartialAvatar src={avatar} alt={title} size="large" />
            <div>
              <Typography.Text>{room.meta?.title}</Typography.Text>
            </div>
          </Space>
          <Space>
            <Popover
              open={popOverOpen}
              onOpenChange={() => setPopOverOpen(false)}
              trigger="click"
              placement="bottomRight"
              arrow={false}
              content={
                <Layout className="max-h-[420px] w-60 overflow-y-auto bg-transparent">
                  <MemberList members={members} />
                  <Divider className="my-1" />
                  <Button
                    type="text"
                    className="text-left"
                    onClick={() => {
                      setPopOverOpen(false);
                      setOpen(true);
                    }}
                    icon={
                      <UserPlus className="align-text-bottom scale-90ggg  " />
                    }
                  >
                    Add users
                  </Button>
                </Layout>
              }
            >
              <HeaderButton onClick={() => setPopOverOpen(true)}>
                <Avatar.Group>
                  {members.slice(0, 3).map(({ avatar, name }, index) => (
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
            </Popover>
            <HeaderButton onClick={() => roomSettingRef.current?.open()}>
              <SidebarExpand
                className="text-sm duration-200 h-9 mx-2 rotate-180"
                strokeWidth="inherit"
              />
            </HeaderButton>
          </Space>
          <RoomSetting ref={roomSettingRef} name={title} roomId={room.id} />
          <AddMemberToRoomModal
            key={room.id}
            roomId={room.id}
            memberList={members}
            open={open}
            onOk={() => setOpen(false)}
            onCancel={() => setOpen(false)}
          />
        </Flex>
      </Layout>
    </ConfigProvider>
  );
}

function MemberList({ members }: { members: User[] }) {
  const { styles, cx } = useSelectableListStyle();
  const currentUser = useAtomValue(currentUserAtom);
  return (
    <ConfigProvider
      list={{
        className: cx(styles.list, styles.listActive),
      }}
      theme={{
        components: {
          List: {
            itemPaddingSM: '8px 8px',
          },
        },
      }}
    >
      <List
        size="small"
        split={false}
        itemLayout="horizontal"
        dataSource={[...members].sort((a, b) => (a.name > b.name ? 1 : 0))}
        renderItem={(item, index) => (
          <List.Item>
            <Flex gap={8} className="relative w-full" align="center">
              <PartialAvatar alt={item.name} size={32} src={item.avatar} />
              <Flex vertical>
                <Typography.Text className="text-sm ">
                  {item.name}
                </Typography.Text>
                {currentUser.id === item.id && (
                  <Typography.Text
                    type="secondary"
                    className="block text-[10px] leading-none"
                  >
                    You
                  </Typography.Text>
                )}
              </Flex>
            </Flex>
          </List.Item>
        )}
      />
    </ConfigProvider>
  );
}

function AddMemberToRoomModal({
  memberList,
  roomId,
  ...props
}: ModalProps & {
  memberList: User[];
  roomId: ID;
}) {
  const workspace = useAtomValue(waitForCurrentWorkspaceAtom);
  const { addMember } = useRoomHelper(workspace.state);
  const [selectedUser, setSelectedUser] = useState<User[]>([]);

  const onAddUser = () => {
    addMember(roomId, selectedUser);
  };
  return (
    <Modal
      {...props}
      title="Add user"
      okText="Add"
      onOk={() => onAddUser()}
      onCancel={(e) => {
        props.onCancel?.(e);
        setSelectedUser([]);
      }}
    >
      <Space direction="vertical" className="w-full" size="large">
        <DebounceSelect
          onChange={(_, options) => {
            setSelectedUser((options as any[]).map((op) => op.other));
          }}
          prefetch
          mode="multiple"
          placeholder="Select users"
          fetchOptions={fetchUserList}
          style={{ width: '100%' }}
          blacklist={memberList.map((item) => item.id)}
        />
      </Space>
    </Modal>
  );
}

async function fetchUserList(username: string) {
  const friends = await HttpProvider.findFriends({ q: username.trim() });

  return friends.map((f) => ({
    label: f.name,
    value: f.id,
    other: f,
  }));
}
