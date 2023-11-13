import { Avatar, Flex, Space, Typography } from 'antd';

type UserCardProps = {
  name: string;
  userName: string;
  avatar: string;
};

export function UserCard({ name, userName, avatar }: UserCardProps) {
  return (
    <Space>
      <Avatar shape="square" alt={userName} src={avatar} />
      <Flex vertical>
        <Typography.Text strong>{name}</Typography.Text>
        <Typography.Text type="secondary" ellipsis>@{userName}</Typography.Text>
      </Flex>
    </Space>
  );
}
