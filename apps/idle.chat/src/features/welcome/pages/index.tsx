import { Button, Card } from 'antd';
import Typography from 'antd/es/typography/Typography';
import NxWelcome from 'app/nx-welcome';
import { useAtomValue } from 'jotai';
import { LoaderFunction } from 'react-router-dom';
import { wrapErrorBoundary } from 'router/AppRouter';
import { currentUser } from 'store/user';

export default function Welcome() {
  const userInfo = useAtomValue(currentUser);
  return (
    <div>
      <Card>
        <Typography>You have logged in as </Typography>
        <Button>Logout</Button>
      </Card>
      <NxWelcome title={userInfo.email} />
    </div>
  );
}

export const Component = () => wrapErrorBoundary(<Welcome />);
export const loader: LoaderFunction = async ({ params }) => null;
