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
import PartialAvatar from '@idle/chat/components/UserCard/PartialAvatar';
import { useAtomValue } from 'jotai';
import { currentUserAtom } from '@idle/chat/store/user';
import { useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AppPages, RouteKey } from '@idle/chat/router/routes';
import UserProfilePopupContent from './UserProfilePopupContent';
import NavIcon from './NavIcon';
import { Plus } from 'iconoir-react';
import NewChatModal from '@idle/chat/features/messaging/pages/components/newchat/NewChatModal';
import { workspaceListAtom } from '@idle/chat/utils/workspace/atom';
import WorkspaceInfo from './WorkspaceInfo';

const { useToken } = theme;

const menuConfig = [
  {
    key: AppPages.home,
    icon: AppPages.home,
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

function getAppNavigateMenu(
  configs: typeof menuConfig,
  currentPage: RouteKey,
): MenuItem[] {
  return configs.map((menuItem) => ({
    key: menuItem.key,
    icon: <NavIcon type={menuItem.icon} solid={currentPage === menuItem.key} />,
    label: (
      <Link to={`/${menuItem.key}`} relative="path">
        {menuItem.label}
      </Link>
    ),
    'data-testid': `gnb-${menuItem.key}`,
  }));
}

export default function GlobalNavbar() {
  const currentUser = useAtomValue(currentUserAtom);
  const [isNewChatModalOpen, setIsNewChatModalOpen] = useState(false);
  const { token } = useToken();
  const location = useLocation();
  const list = useAtomValue(workspaceListAtom);

  const currentPage = location.pathname.split('/')[1] as RouteKey;

  const menuItems = useMemo(
    () => getAppNavigateMenu(menuConfig, currentPage),
    [currentPage],
  );

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
          metadata={{ flavour: list[0].flavour, id: list[0].id }}
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
            selectedKeys={[currentPage]}
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
