import { Card, Layout } from 'antd';

import Typography from 'antd/es/typography/Typography';
import NxWelcome from 'app/nx-welcome';
import { useAtomValue } from 'jotai';
import { wrapErrorBoundary } from 'router/AppRouter';
import { currentUserAtom } from 'store/user';

export default function Welcome() {
  const userInfo = useAtomValue(currentUserAtom);

  return (
    <Layout className="h-full">
      <Layout.Sider theme="light" width={300}>
        sidebar
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
