import { useAtomValue } from 'jotai';
import { Card, Typography } from 'antd';
import { currentUserAtom } from '../../../store/user';
import { RoomLayout } from './RoomLayout';

export function Component() {
  const userInfo = useAtomValue(currentUserAtom);

  return (
    <RoomLayout>
      <Card>
        <Typography>You have logged in as {userInfo.name} </Typography>
      </Card>
    </RoomLayout>
  );
}

Component.displayName = 'RoomDetail';
