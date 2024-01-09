import { Layout, ConfigProvider, theme } from 'antd';

import { Outlet } from 'react-router-dom';
import { Suspense, useEffect, useState } from 'react';
import { FireBaseInstance } from '../Firebase';
import createFirstAppData from '../bootstrap/createFirstAppData';
import RootAppSidebar from '../components/RootAppSidebar/RootAppSidebar';
import { wrapErrorBoundary } from '../router/wrapErrorBoundary';

const { useToken } = theme;

export default function AppLayoutWithGnb() {
  const [loading, setLoading] = useState(true);
  const { token } = useToken();
  // save FCM token to server if user has loggedIn
  useEffect(() => {
    (async () => {
      FireBaseInstance.start();
    })();
  }, []);

  useEffect(() => {
    createFirstAppData().then(() => setLoading(false));
  }, []);

  if (loading) {
    return null;
  }
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
          <RootAppSidebar />
        </aside>

        <Layout.Content>
          {/* <button
            type="button"
            onClick={async () => {
              const token = await new Account(AppWriteProvider).createJWT();
              await navigator.clipboard.writeText(token.jwt);
              console.log('Token copied to clipboard: ', token.jwt);
            }}
          >
            issue token
          </button> */}
          <Suspense fallback="creating app data">
            <Outlet />
          </Suspense>
        </Layout.Content>
      </Layout>
    </ConfigProvider>
  );
}

export const Component = () => {
  return wrapErrorBoundary(<AppLayoutWithGnb />);
};

// export const loader: LoaderFunction = async ({ params }) => null;
