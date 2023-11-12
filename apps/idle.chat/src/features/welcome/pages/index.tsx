import { Button, Card } from 'antd';
import Typography from 'antd/es/typography/Typography';
import NxWelcome from 'app/nx-welcome';
import { useAuth } from 'hooks/useAuth';
import { useAtom } from 'jotai';
import { LoaderFunction } from 'react-router-dom';
import { wrapErrorBoundary } from 'router/AppRouter';
import { ProtectedRoute } from 'router/ProtectedRoute';
import { currentUserAtom } from 'store/user';

export default function Welcome() {
  const [userInfo] = useAtom(currentUserAtom);
  const { logout } = useAuth();

  const logOutUser = async () => {
    await logout();
  };
  return (
    <div>
      <Card>
        <Typography>You have logged in as {userInfo.name} </Typography>
        <Button onClick={logOutUser}>Logout</Button>
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
