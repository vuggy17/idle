import { Layout, ConfigProvider, theme, Button } from 'antd';

import GlobalNavbar from '@idle/chat/components/GlobalNavbar/GlobalNavbar';
import { Outlet } from 'react-router-dom';
import { wrapErrorBoundary } from '@idle/chat/router/wrapErrorBoundary';
import ProtectedRoute from '@idle/chat/router/ProtectedRoute';
import { FireBaseInstance } from '../Firebase';
import { Suspense, useEffect } from 'react';
import { useAtom, useAtomValue } from 'jotai';
import {
  currentWorkspaceAtom,
  workspaceListAtom,
} from '../utils/workspace/atom';
import useWorkspace from '../hooks/useWorkspace';
// import { Account } from 'appwrite';
// import { AppWriteProvider } from '../providers/appwrite';

const { useToken } = theme;

export default function AppLayoutWithGnb() {
  const { token } = useToken();
  const [_, setCurrentWorkspace] = useAtom(currentWorkspaceAtom);
  const list = useAtomValue(workspaceListAtom);
  console.log(
    '🚀 ~ file: AppLayoutWithGnb.tsx:24 ~ AppLayoutWithGnb ~ list:',
    list,
  );
  const firstWorkspaceMeta = list[0];
  const workspace = useWorkspace(firstWorkspaceMeta);
  useEffect(() => {
    console.log(
      '🚀 ~ file: AppLayoutWithGnb.tsx:29 ~ useEffect ~ workspace:',
      workspace,
    );
    if (!workspace) {
      setCurrentWorkspace(null);
    }

    setCurrentWorkspace(workspace);
  }, [firstWorkspaceMeta, list, workspace]);

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
