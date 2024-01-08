import { Layout } from 'antd';
import { useAtom } from 'jotai';
import { PropsWithChildren } from 'react';
import { wrapErrorBoundary } from '../../../router/wrapErrorBoundary';
import { activeChatIdAtom } from '../../../store/chat';

import ChatSideBar from '../components/sidebar';

function Component({ children }: PropsWithChildren) {
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
      <Layout.Content className="overflow-y-auto">{children}</Layout.Content>
    </Layout>
    // </Suspense>
  );
}

export const RoomLayout = ({ children }: PropsWithChildren) => {
  return wrapErrorBoundary(<Component>{children}</Component>);
};

// export const loader: LoaderFunction = async ({ params }) => null;
