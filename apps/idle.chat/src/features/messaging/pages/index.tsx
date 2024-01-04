import { Button, Card, Layout } from 'antd';

import Typography from 'antd/es/typography/Typography';
import NxWelcome from '@idle/chat/app/nx-welcome';
import { useAtom, useAtomValue } from 'jotai';
import { wrapErrorBoundary } from '@idle/chat/router/wrapErrorBoundary';
import { currentUserAtom } from '@idle/chat/store/user';
import { activeChatIdAtom } from '@idle/chat/store/chat';
import ChatSideBar from './components/sidebar';
import { Suspense, useEffect } from 'react';
import createFirstAppData from '@idle/chat/bootstrap/createFirstAppData';
import { workspaceListAtom } from '@idle/chat/utils/workspace/atom';

export default function Welcome() {
  const userInfo = useAtomValue(currentUserAtom);
  const [activeChatId, setActiveChatId] = useAtom(activeChatIdAtom);
  // const list = useAtomValue(workspaceListAtom);
  // console.log(list);
  return (
    // <Suspense fallback="loading workspace list">
      <Layout className="h-full">
        <Layout.Sider theme="light" width={300}>
          <ChatSideBar
            activeConversation={activeChatId}
            onItemClick={(item) => {
              setActiveChatId(item.id);
            }}
          />
        </Layout.Sider>
        <Layout.Content className="overflow-y-auto">
          <Card>
            <Typography>You have logged in as {userInfo.name} </Typography>
            <Button onClick={() => createFirstAppData()}>
              Create first workspace
            </Button>
          </Card>
          <NxWelcome title={userInfo.name} />
        </Layout.Content>
      </Layout>
    // </Suspense>
  );
}

export const Component = () => {
  return wrapErrorBoundary(<Welcome />);
};

// export const loader: LoaderFunction = async ({ params }) => null;
