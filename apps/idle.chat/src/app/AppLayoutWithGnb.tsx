import { Layout, ConfigProvider, theme } from 'antd';

import GlobalNavbar from '@idle/chat/components/GlobalNavbar/GlobalNavbar';
import { Outlet } from 'react-router-dom';
import { wrapErrorBoundary } from '@idle/chat/router/wrapErrorBoundary';
import ProtectedRoute from '@idle/chat/router/ProtectedRoute';
import { FireBaseInstance } from '../Firebase';
import { useEffect } from 'react';

const { useToken } = theme;

export default function AppLayoutWithGnb() {
  const { token } = useToken();

  // save FCM token to server if user has loggedIn
  useEffect(() => {
    (async () => {
      FireBaseInstance.start();
      console.log('FCM token', token);
    })();
  }, []);

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
      <Layout className="h-full" hasSider>
        <aside className="relative z-10 w-20">
          <GlobalNavbar />
        </aside>
        <Layout.Content>
          <Outlet />
        </Layout.Content>
      </Layout>
    </ConfigProvider>
  );
}

export const Component = () => {
  return wrapErrorBoundary(
    <ProtectedRoute>
      <AppLayoutWithGnb />
    </ProtectedRoute>,
  );
};

// export const loader: LoaderFunction = async ({ params }) => null;
