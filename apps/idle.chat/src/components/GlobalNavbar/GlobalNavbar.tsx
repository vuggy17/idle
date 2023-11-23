import {
  ConfigProvider,
  Flex,
  Menu,
  MenuProps,
  Popover,
  Tooltip,
  theme,
} from 'antd';
import PartialAvatar from 'components/UserCard/PartialAvatar';
import { useAtomValue } from 'jotai';
import { currentUserAtom } from 'store/user';
import { useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AppPages, RouteKey } from 'router/routes';
import UserProfilePopupContent from './UserProfilePopupContent';
import NavIcon from './NavIcon';

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
  }));
}

export default function GlobalNavbar() {
  const currentUser = useAtomValue(currentUserAtom);
  const { token } = useToken();
  const location = useLocation();

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
        <PartialAvatar
          shape="square"
          src="https://placehold.co/600x400"
          size={52}
          className="mx-auto mb-6 hover:cursor-pointer"
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
        <Tooltip title={currentUser.name}>
          <Popover
            content={<UserProfilePopupContent user={currentUser} />}
            trigger="click"
            placement="rightTop"
          >
            <PartialAvatar
              shape="square"
              size={42}
              className="mx-auto hover:cursor-pointer"
            />
          </Popover>
        </Tooltip>
      </Flex>
    </ConfigProvider>
  );
}
