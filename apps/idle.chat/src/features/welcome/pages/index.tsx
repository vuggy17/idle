import { Button, Card } from 'antd';
import Typography from 'antd/es/typography/Typography';
import NxWelcome from 'app/nx-welcome';
import { useAtomValue } from 'jotai';
import { LoaderFunction } from 'react-router-dom';
import { wrapErrorBoundary } from 'router/AppRouter';
import { ProtectedRoute } from 'router/ProtectedRoute';
import { currentUserAtom } from 'store/user';

export default function Welcome() {
  const userInfo = useAtomValue(currentUserAtom);
  console.log("🚀 ~ file: index.tsx:12 ~ Welcome ~ userInfo:", userInfo)
  return (
    <div>
      <Card>
        <Typography>You have logged in as  {userInfo.name}  </Typography>
        <Button>Logout</Button>
      </Card>
      <NxWelcome title={userInfo.name} />
    </div>
  );
}

export const Component = () =>
  wrapErrorBoundary(
    <ProtectedRoute>
      <Welcome />
    </ProtectedRoute>
  );
export const loader: LoaderFunction = async ({ params }) => null;
