import { Avatar, Button, List, Typography } from 'antd';
import { useMemo } from 'react';

type ListItemProps = (typeof List)['Item']['defaultProps'];

export function SearchResultCard({
  name,
  avatar,
  bio,
  isFriend = false,
  ...listItemProps
}: SearchResultCardProps) {
  const userDescription = useMemo(() => {
    const sections: string[] = [];
    if (isFriend) {
      sections.push('Friend');
    }
    if (bio) {
      sections.push(bio);
    }
    return (
      <Typography.Paragraph
        style={{
          margin: 0,
        }}
        ellipsis={{
          rows: 2,
        }}
      >
        {sections.join('・')}
      </Typography.Paragraph>
    );
  }, [isFriend, bio]);

  const resultAction = useMemo(() => {
    if (isFriend) {
      return <Button>Message</Button>;
    }
    return <Button>Add friend</Button>;
  }, [isFriend]);

  return (
    <List.Item actions={[resultAction]} {...listItemProps}>
      <List.Item.Meta
        avatar={<Avatar src={avatar} />}
        title={name}
        description={userDescription}
      />
    </List.Item>
  );
}
export type SearchResultCardProps = {
  name: string;
  avatar: string;
  isFriend?: boolean;
  bio: string;
} & ListItemProps;
