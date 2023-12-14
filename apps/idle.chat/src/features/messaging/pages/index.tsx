import { Card, Layout } from 'antd';

import Typography from 'antd/es/typography/Typography';
import NxWelcome from '@idle/chat/app/nx-welcome';
import { useAtom, useAtomValue } from 'jotai';
import { wrapErrorBoundary } from '@idle/chat/router/wrapErrorBoundary';
import { currentUserAtom } from '@idle/chat/store/user';
import ChatSideBar from './components/sidebar';
import { activeChatIdAtom } from '@idle/chat/store/chat';

export default function Welcome() {
  const userInfo = useAtomValue(currentUserAtom);
  const [activeChatId, setActiveChatId] = useAtom(activeChatIdAtom);

  return (
    <Layout className="h-full">
      <Layout.Sider theme="light" width={300}>
        <ChatSideBar
          activeConversation={activeChatId}
          onItemClick={(item) => {
            console.log(item.id)
            setActiveChatId(item.id);
          }}
        />
      </Layout.Sider>
      <Layout.Content className="overflow-y-auto">
        <Card>
          <Typography>You have logged in as {userInfo.name} </Typography>
        </Card>
        <NxWelcome title={userInfo.name} />
      </Layout.Content>
    </Layout>
  );
}

export const Component = () => {
  return wrapErrorBoundary(<Welcome />);
};

// export const loader: LoaderFunction = async ({ params }) => null;
