import { Layout, ConfigProvider, theme } from 'antd';

import GlobalNavbar from 'components/GlobalNavbar/GlobalNavbar';
import { Outlet } from 'react-router-dom';
import { wrapErrorBoundary } from 'router/wrapErrorBoundary';
import ProtectedRoute from 'router/ProtectedRoute';

const { useToken } = theme;

export default function AppLayoutWithGnb() {
  const { token } = useToken();

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
