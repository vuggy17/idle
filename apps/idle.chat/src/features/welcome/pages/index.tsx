import { Button, Card, Modal, Layout, ConfigProvider, theme } from 'antd';

import Typography from 'antd/es/typography/Typography';
import ModalFallback from 'components/Fallbacks/ModalFallback';
import GlobalNavbar from 'components/GlobalNavbar/GlobalNavbar';
import useAuth from 'hooks/useAuth';
import { useAtomValue } from 'jotai';
import { Suspense, lazy, useState } from 'react';
import { wrapErrorBoundary } from 'router/AppRouter';
import ProtectedRoute from 'router/ProtectedRoute';
import { currentUserAtom } from 'store/user';

const PreferencePage = lazy(
  () => import('features/preference/ui/pages/Preference'),
);

const { useToken } = theme;

export default function Welcome() {
  const userInfo = useAtomValue(currentUserAtom);
  const { token } = useToken();

  const { logout } = useAuth();
  const [openSettingModal, setOpenSettingModal] = useState(false);

  const logOutUser = async () => {
    await logout();
  };

  return (
    <ConfigProvider
      theme={{
        components: {
          Layout: {
            siderBg: token.colorBgLayout,
          },
        },
      }}
    >
      <Layout className="h-full">
        <Layout.Sider width={80}>
          <GlobalNavbar />
        </Layout.Sider>
        <Layout.Content>
          <Layout className="h-full">
            <Layout.Sider theme="light" width={300}>
              sidebar
            </Layout.Sider>
            <Layout.Content>
              <Card>
                <Typography>You have logged in as {userInfo.name} </Typography>
                <Button onClick={logOutUser}>Logout</Button>
                <Button onClick={() => setOpenSettingModal(true)}>
                  Open setting
                </Button>
              </Card>
            </Layout.Content>
          </Layout>
        </Layout.Content>
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
      </Layout>
    </ConfigProvider>
  );
}

export const Component = () => {
  return wrapErrorBoundary(
    <ProtectedRoute>
      <Welcome />
    </ProtectedRoute>,
  );
};

// export const loader: LoaderFunction = async ({ params }) => null;
