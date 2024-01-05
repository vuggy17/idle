import { Layout, ConfigProvider, theme, Button } from 'antd';

import RootAppSidebar from '@idle/chat/components/RootAppSidebar/RootAppSidebar';
import { Outlet } from 'react-router-dom';
import { wrapErrorBoundary } from '@idle/chat/router/wrapErrorBoundary';
import ProtectedRoute from '@idle/chat/router/ProtectedRoute';
import { FireBaseInstance } from '../Firebase';
import { Suspense, useEffect, useState } from 'react';
import { useAtom, useAtomValue } from 'jotai';
import {
  currentWorkspaceAtom,
  workspaceListAtom,
} from '../utils/workspace/atom';
import useWorkspace from '../hooks/useWorkspace';
import createFirstAppData from '../bootstrap/createFirstAppData';
// import { Account } from 'appwrite';
// import { AppWriteProvider } from '../providers/appwrite';

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
    return;
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
  return wrapErrorBoundary(
    <ProtectedRoute>
      <AppLayoutWithGnb />
    </ProtectedRoute>,
  );
};

// export const loader: LoaderFunction = async ({ params }) => null;
