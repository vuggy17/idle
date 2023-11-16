import { Avatar, Flex, Space, Typography } from 'antd';

type UserCardProps = {
  name: string;
  userName: string;
  avatar?: string;
};

export function UserCard({ name, userName, avatar }: UserCardProps) {
  return (
    <Space>
      {avatar ? (
        <Avatar shape="square" alt={userName} src={avatar} />
      ) : (
        <Avatar shape="square" style={{ backgroundColor: '#f56a00' }}>
          {
            // generate user name, ex: appwrite dev => AD
            name
              .split(' ')
              .map((shortName) => shortName.charAt(0))
              .join('')
              .toUpperCase()
              .slice(0, 2)
          }
        </Avatar>
      )}

      <Flex vertical>
        <Typography.Text strong>{name}</Typography.Text>
        <Typography.Text type="secondary" ellipsis>
          @{userName}
        </Typography.Text>
      </Flex>
    </Space>
  );
}
