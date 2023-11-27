import { Avatar, Button, List } from 'antd';
import { useMemo } from 'react';

export function SearchResultCard({
  name,
  avatar,
  bio,
  isFriend = false,
}: SearchResultCardProps) {
  const userDescription = useMemo(() => {
    const sections: string[] = [];
    if (isFriend) {
      sections.push('Friend');
    }
    if (bio) {
      sections.push(bio);
    }
    return sections.join('・');
  }, [isFriend, bio]);

  const resultAction = useMemo(() => {
    if (isFriend) {
      return <Button>Message</Button>;
    }
    return <Button>Add friend</Button>;
  }, [isFriend]);

  return (
    <List.Item actions={[resultAction]}>
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
};
