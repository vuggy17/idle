import { ConfigProvider, Layout, Menu, Space, Typography } from 'antd';
import type { MenuProps } from 'antd/es/menu';
import { useMemo, useState } from 'react';
import { useAtomValue } from 'jotai';
import { Bell, LayoutRight, PeopleTag, Settings } from 'iconoir-react';
import { wrapErrorBoundary } from '../../../router/wrapErrorBoundary';
import UnderConstruction from '../../../components/UnderConstruction';
import { currentUserAtom } from '../../../store/user';
import UserCard from '../../../components/UserCard';
import MyAccount from './MyAccount';
import MyNotification from './MyNotification';
import General from './General';
import { PreferenceSubPages, SubPages } from './availablePages';
import MySetting from './MySetting';

type MenuItem = Required<MenuProps>['items'][number];

const { Sider, Content, Header } = Layout;

const contentStyle: React.CSSProperties = {
  minHeight: 640,
  paddingLeft: 40,
  paddingRight: 24,
};

function getSettingMenu(
  label: React.ReactNode,
  key?: React.Key | null,
  icon?: React.ReactNode,
  children?: MenuItem[],
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
  } as MenuItem;
}

const settings: MenuItem[] = [
  getSettingMenu(
    'General',
    PreferenceSubPages.General,
    <LayoutRight width={20} height={20} />,
  ),
  getSettingMenu(
    'My account',
    PreferenceSubPages.MyAccount,
    <PeopleTag width={20} height={20} />,
  ),
  getSettingMenu(
    'My settings',
    PreferenceSubPages.MySetting,
    <Settings width={20} height={20} />,
  ),
  getSettingMenu(
    'My notifications',
    PreferenceSubPages.MyNotification,
    <Bell width={20} height={20} />,
  ),
];

function Preference() {
  const [pageSelection, setPageSelection] = useState<SubPages>(
    PreferenceSubPages.General,
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
        return (
          <General
            navigateToPage={(page: SubPages) => setPageSelection(page)}
          />
        );
      case PreferenceSubPages.MyNotification:
        return <MyNotification />;
      case PreferenceSubPages.MySetting:
        return <MySetting />;
      case PreferenceSubPages.MyAccount:
        return <MyAccount user={currentUser} />;
      default:
        return <UnderConstruction />;
    }
  }, [currentUser, pageSelection]);

  return (
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
          <Sider theme="light" width={320}>
            <Header>
              <Typography.Text
                strong
                className="text-[#807f7a] text-xs tracking-wide"
              >
                Account
              </Typography.Text>
            </Header>
            <Space direction="vertical" className="w-full ">
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

const Component = () => wrapErrorBoundary(<Preference />);

export default Component;
