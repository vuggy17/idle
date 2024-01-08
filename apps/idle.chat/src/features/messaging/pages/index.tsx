import { Button, Card, Layout, Typography } from 'antd';
import { useAtomValue, useAtom } from 'jotai';
import { Outlet } from 'react-router-dom';
import createFirstAppData from '../../../bootstrap/createFirstAppData';
import { wrapErrorBoundary } from '../../../router/wrapErrorBoundary';
import { activeChatIdAtom } from '../../../store/chat';
import { currentUserAtom } from '../../../store/user';

import ChatSideBar from '../components/sidebar';

export default function MessagingLayout() {
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
        <Outlet />
      </Layout.Content>
    </Layout>
    // </Suspense>
  );
}

export const Component = () => {
  return wrapErrorBoundary(<MessagingLayout />);
};

// export const loader: LoaderFunction = async ({ params }) => null;
