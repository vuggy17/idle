import {
  App,
  Badge,
  Button,
  ConfigProvider,
  Divider,
  Flex,
  Menu,
  MenuProps,
  Modal,
  Typography,
  theme,
} from 'antd';
import ModalFallback from 'components/Fallbacks/ModalFallback';
import UserCard from 'components/UserCard';
import { User } from 'features/auth/entities/user';
import useAuth from 'hooks/useAuth';
import { lazy, useState, Suspense } from 'react';

const PreferencePage = lazy(
  () => import('features/preference/ui/pages/Preference'),
);

type MenuItem = Required<MenuProps>['items'][number];

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

export const UserAction = {
  openAccountSetting: 'open_setting_action',
  logoutConfirm: 'logout_confirm_action',
  logout: 'logout_action',
  openThemeSetting: 'open_theme_setting',
};

const menuItems = [
  getSettingMenu('Open account setting', UserAction.openAccountSetting),
  getSettingMenu('Change theme', UserAction.openThemeSetting),
];

const { useApp } = App;
const { useToken } = theme;

export default function UserProfilePopupContent({ user }: { user: User }) {
  const [openSettingModal, setOpenSettingModal] = useState(false);
  const { modal } = useApp();
  const { token } = useToken();
  const { logout } = useAuth();

  const handleUserActions = (action: string) => {
    switch (action) {
      case UserAction.openAccountSetting:
        setOpenSettingModal(true);
        break;

      case UserAction.logoutConfirm:
        // open logout confirm box
        modal.confirm({
          centered: true,
          title: 'Sign out of Idle',
          content:
            "We'll sign you out and remove any offline data, including message drafts.",
          okText: 'Sign out',
          cancelText: 'Cancel',
        });
        break;
      case UserAction.logout:
        logout();
        break;
      default:
        console.warn(`Unknown handler for ${action} action`);
    }
  };

  return (
    <div className="min-w-[320px]">
      <ConfigProvider
        theme={{
          components: {
            Menu: {
              itemHeight: 32,
            },
            Divider: {
              marginLG: 4,
            },
            Button: {
              linkHoverBg: token.colorBgTextHover,
              colorLinkHover: token.colorLink,
            },
          },
        }}
      >
        <Flex justify="space-between" className="w-full pl-2 mb-4">
          <Badge
            status="success"
            text={<Typography.Text type="secondary">Connected</Typography.Text>}
          />

          <Button
            size="small"
            type="link"
            onClick={() => handleUserActions(UserAction.logoutConfirm)}
          >
            Sign out
          </Button>
        </Flex>
        {/* user card */}
        <ConfigProvider
          theme={{
            components: {
              Menu: {
                itemHeight: 52,
              },
            },
          }}
        >
          <Menu
            defaultSelectedKeys={['user_card']}
            style={{
              border: 'none',
            }}
          >
            <Menu.Item key="user_card">
              <UserCard userName={user.email} name={user.name} />
            </Menu.Item>
          </Menu>
        </ConfigProvider>
        <Divider />

        {/* profile action */}
        <Menu
          onClick={({ key }) => handleUserActions(key)}
          items={menuItems}
          selectable={false}
          style={{
            border: 'none',
          }}
        />
      </ConfigProvider>

      {/* setting modal */}
      <Modal
        centered
        closeIcon={null}
        footer={null}
        open={openSettingModal}
        width={1280}
        onCancel={() => setOpenSettingModal(false)}
      >
        <Suspense
          fallback={
            <ModalFallback className="w-full min-h-[300px] align-middle" />
          }
        >
          <PreferencePage />
        </Suspense>
      </Modal>

      {/* logout confirm modal */}
      <Modal centered />
    </div>
  );
}