import { Flex, Space, Typography } from 'antd';
import PartialAvatar from './partial-avatar';

type UserCardProps = {
  name: string;
  userName: string;
  avatar?: string;
};

export default function UserCard({
  name,
  userName,
  avatar = '',
}: UserCardProps) {
  return (
    <Space>
      <PartialAvatar shape="square" src={avatar} alt={userName} />
      <Flex vertical>
        <Typography.Text strong>{name}</Typography.Text>
        <Typography.Text type="secondary" ellipsis>
          @{userName}
        </Typography.Text>
      </Flex>
    </Space>
  );
}
