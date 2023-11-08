import { Button, Card } from 'antd';
import Typography from 'antd/es/typography/Typography';
import NxWelcome from 'app/nx-welcome';
import { useAtomValue } from 'jotai';
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
