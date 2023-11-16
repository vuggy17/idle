import {
  Button,
  Card,
  ConfigProvider,
  Layout,
  Menu,
  Modal,
  Space,
  Typography,
} from 'antd';
import { Link, LoaderFunction } from 'react-router-dom';
import { wrapErrorBoundary } from 'router/AppRouter';
import { ProtectedRoute } from 'router/ProtectedRoute';

import type { MenuProps } from 'antd/es/menu';
import { useMemo, useState } from 'react';
import MyAccount from './MyAccount';
import UnderConstruction from 'components/UnderConstruction';
import { UserCard } from '../components/UserCard';
import { useAtomValue } from 'jotai';
import { currentUserAtom } from 'store/user';

type MenuItem = Required<MenuProps>['items'][number];

const { Sider, Content, Header } = Layout;

const contentStyle: React.CSSProperties = {
  minHeight: 640,
  lineHeight: '120px',
  // color: '#fff',
  backgroundColor: '#fff',
  // paddingTop: 42,
};

const menuIcon = (
  <span className="align-middle">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
    >
      <rect width="100%" height="100%" fill="#FFA500" />
      <path
        fill="#FFFFFF"
        d="M5.03 13.25h.93q.1 0 .16.06t.06.15v.37H3.69v-.21q0-.06.03-.13t.09-.12l1.09-1.1q.14-.14.25-.27.11-.13.18-.25.07-.13.11-.25.04-.13.04-.27 0-.13-.04-.23-.03-.1-.1-.17t-.17-.1q-.09-.04-.21-.04t-.21.04q-.09.03-.16.08-.08.06-.13.13-.05.08-.07.17-.05.12-.11.15-.07.04-.2.02l-.32-.06q.03-.26.14-.45.11-.2.27-.33.16-.13.37-.2t.45-.07q.25 0 .46.08.21.07.35.21.15.13.23.32.08.19.08.42 0 .2-.05.38-.06.17-.16.32t-.23.3l-.28.3-.81.83q.11-.04.23-.06.12-.02.22-.02Zm2.06-.78h1.1v-1.18q0-.17.02-.38l-1.12 1.56Zm1.63 0h.46v.35q0 .05-.03.09-.04.04-.1.04h-.33v.88h-.53v-.88H6.66q-.06 0-.11-.04t-.06-.1l-.06-.31 1.71-2.29h.58v2.26Zm4.43.53-.33.32-.84-.84-.86.85-.33-.32.86-.86-.82-.82.33-.32.81.82.81-.81.33.32-.81.81.85.85Zm3.01.25h.93q.1 0 .16.06t.06.15v.37h-2.48v-.21q0-.06.02-.13.03-.07.09-.12l1.09-1.1q.14-.14.25-.27.11-.13.18-.25.07-.13.11-.25.04-.13.04-.27 0-.13-.04-.23-.03-.1-.1-.17t-.17-.1q-.09-.04-.21-.04-.11 0-.21.04-.09.03-.16.08-.08.06-.13.13-.05.08-.07.17-.04.12-.11.15-.07.04-.2.02l-.32-.06q.04-.26.14-.45.11-.2.27-.33.16-.13.37-.2t.45-.07q.25 0 .46.08.21.07.35.21.15.13.23.32.09.19.09.42 0 .2-.06.38-.06.17-.16.32t-.23.3l-.28.3-.81.83q.11-.04.23-.06.12-.02.22-.02Zm2.06-.78h1.1v-1.18q0-.17.02-.38l-1.12 1.56Zm1.63 0h.46v.35q0 .05-.04.09-.03.04-.09.04h-.33v.88h-.53v-.88h-1.53q-.06 0-.11-.04t-.06-.1l-.07-.31 1.72-2.29h.58v2.26Z"
      />
    </svg>
  </span>
);
// setting menus

function getSettingMenu(
  label: React.ReactNode,
  key?: React.Key | null,
  icon?: React.ReactNode,
  children?: MenuItem[]
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
  } as MenuItem;
}

const PreferenceSubPages = {
  General: '1',
  MyAccount: '2',
  MySetting: '3',
  MyNotification: '4',
} as const;

type ValueOf<T> = T[keyof T];
type SubPages = ValueOf<typeof PreferenceSubPages>;

// <Link to="General">
const settings: MenuItem[] = [
  getSettingMenu('General', PreferenceSubPages.General, menuIcon),
  getSettingMenu('My account', PreferenceSubPages.MyAccount, menuIcon),
  getSettingMenu('My settings', PreferenceSubPages.MySetting, menuIcon),
  getSettingMenu(
    'My notifications',
    PreferenceSubPages.MyNotification,
    menuIcon
  ),
];

function Preference() {
  const [pageSelection, setPageSelection] = useState<SubPages>(
    PreferenceSubPages.General
  );
  const currentUser = useAtomValue(currentUserAtom);

  const onPageSelected = (page: SubPages) => {
    if (pageSelection === page) {
      return;
    }
    setPageSelection(page);
  };

  const subPage = useMemo(() => {
    switch (pageSelection) {
      case PreferenceSubPages.General:
        return <UnderConstruction />;
      case PreferenceSubPages.MyNotification:
        return <UnderConstruction />;
      case PreferenceSubPages.MySetting:
        return <UnderConstruction />;
      case PreferenceSubPages.MyAccount:
        return <MyAccount user={currentUser} />;
      default:
        return <UnderConstruction />;
    }
  }, [currentUser, pageSelection]);

  return (
    // <Layout className="max-w-3xl min-w-3xl mx-auto">
    <Layout>
      <ConfigProvider
        theme={{
          components: {
            Layout: {
              headerHeight: 32,
              headerBg: 'transparent',
              headerPadding: '0px 16px',
            },
            Menu: {
              itemHeight: 32,
            },
          },
        }}
      >
        <Layout>
          <Sider theme="light" width={360} className="pt-3">
            <Header>
              <Typography.Text
                strong
                className="text-[#807f7a] text-xs tracking-wide"
              >
                Account
              </Typography.Text>
            </Header>
            <Space direction="vertical" className="w-full max-w-xs">
              <div className="pl-4">
                <UserCard
                  name={currentUser.name}
                  userName={currentUser.email}
                />
              </div>
              <Menu
                inlineIndent={16}
                style={{
                  border: 'none',
                }}
                mode="inline"
                selectedKeys={[pageSelection]}
                onSelect={({ key }) => onPageSelected(key as SubPages)}
                defaultSelectedKeys={[PreferenceSubPages.General]}
                items={settings}
              />
            </Space>
          </Sider>
          <Content style={contentStyle}>{subPage}</Content>
        </Layout>
      </ConfigProvider>
    </Layout>
  );
}

export const Component = () =>
  wrapErrorBoundary(
    <ProtectedRoute>
      <Preference />
    </ProtectedRoute>
  );
export const loader: LoaderFunction = async ({ params }) => null;