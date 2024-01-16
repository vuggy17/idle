import {
  Button,
  ConfigProvider,
  Flex,
  Menu,
  MenuProps,
  Popover,
  Tooltip,
  theme,
} from 'antd';
import { useAtomValue } from 'jotai';
import { useState } from 'react';
import { Link, useMatches } from 'react-router-dom';
import { Plus } from 'iconoir-react';
import { waitForCurrentWorkspaceAtom } from '../../utils/workspace/atom';
import { AppPages } from '../../router/routes';
import { currentUserAtom } from '../../store/user';
import NavIcon from './icon';
import UserProfilePopupContent from './user-profile-popup-content';
import WorkspaceInfo from './workspace-info';
import NewChatModal from '../../features/messaging/components/new-chat-modal';
import PartialAvatar from '../user-card/partial-avatar';

const { useToken } = theme;

const menuConfig = [
  {
    key: 'workspace',
    icon: AppPages.workspace,
    label: 'Home',
  },
  {
    key: AppPages.dm,
    icon: AppPages.dm,
    label: 'DMs',
  },
  {
    key: AppPages.activity,
    icon: AppPages.activity,
    label: 'Activity',
  },
  {
    key: AppPages.discover,
    icon: AppPages.discover,
    label: 'Discover',
  },
];

type MenuItem = Required<MenuProps>['items'][number];

function useNavIcons(configs: typeof menuConfig): MenuItem[] {
  return configs.map((menuItem) => ({
    key: menuItem.key,
    icon: <NavIcon type={menuItem.icon} matchPattern={menuItem.key} />,
    label: menuItem.label,
    'data-testid': `gnb-${menuItem.key}`,
  }));
}

export default function RootAppSidebar() {
  const { token } = useToken();
  const currentUser = useAtomValue(currentUserAtom);
  const workspace = useAtomValue(waitForCurrentWorkspaceAtom);
  const matches = useMatches();

  const [isNewChatModalOpen, setIsNewChatModalOpen] = useState(false);
  const menuItems = useNavIcons(menuConfig);

  return (
    <ConfigProvider
      theme={{
        components: {
          Popover: {
            zIndexPopup: 1080, // make user name tooltip won't overlay popover
          },
        },
      }}
    >
      <Flex
        className="h-full pb-6 pt-4"
        style={{
          boxShadow: 'rgba(0, 0, 0, 0.15) 2.4px 0 12px inset',
        }}
        vertical
        justify="space-between"
        align="center"
      >
        {/* workspace icon */}
        <WorkspaceInfo
          metadata={{ flavour: workspace.flavour, id: workspace.id }}
        />
        <ConfigProvider
          theme={{
            components: {
              Menu: {
                itemBg: token.colorBgLayout,
                // collapsedIconSize: 20,  this wont work
                // TODO: let's report a issue 💪
                fontSizeLG: 20, // icon size, see: https://github.com/ant-design/ant-design/blob/3233ac498ff2f2c611b727dc99cc399d9e074a65/components/menu/style/index.tsx#L993C9-L993C26
              },
            },
          }}
        >
          <Menu
            selectedKeys={[(matches[2].handle as any)?.crumb]}
            mode="inline"
            inlineCollapsed
            inlineIndent={0}
            style={{
              border: 'none',
              width: 'fit-content',
            }}
            items={menuItems}
          />
        </ConfigProvider>
        <div>
          <Tooltip title="Create conversation">
            <Button
              onClick={() => setIsNewChatModalOpen(true)}
              type="primary"
              size="large"
              className="align-top block mx-auto mb-4 hover:rotate-45"
              icon={
                <Plus
                  height={18}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    verticalAlign: '-.2em',
                  }}
                />
              }
            />
          </Tooltip>

          <Tooltip title={currentUser.name}>
            <Popover
              content={<UserProfilePopupContent user={currentUser} />}
              trigger="click"
              placement="rightTop"
            >
              <PartialAvatar
                src={currentUser.avatar || currentUser.name}
                shape="square"
                size={42}
                className="mx-auto hover:cursor-pointer"
              />
            </Popover>
          </Tooltip>
        </div>
      </Flex>
      <NewChatModal
        width={600}
        title="New message"
        open={isNewChatModalOpen}
        onCancel={() => setIsNewChatModalOpen(false)}
        onOk={() => setIsNewChatModalOpen(true)}
        okText="Create"
      />
    </ConfigProvider>
  );
}
