import { List } from 'antd';
import { useMemo } from 'react';
import { ListItemProps } from 'antd/es/list';
import PartialAvatar from '../../../components/user-card/partial-avatar';

export function CommonSearchResult({
  id,
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
      <div
        className="h-[3rem] line-clamp-2"
        style={{
          margin: 0,
        }}
      >
        {sections.join('・')}
      </div>
    );
  }, [isFriend, bio]);

  return (
    <List.Item {...listItemProps}>
      <List.Item.Meta
        avatar={<PartialAvatar src={avatar} alt={name} />}
        title={name}
        description={userDescription}
      />
    </List.Item>
  );
}
export interface SearchResultCardProps extends ListItemProps {
  id: string;
  name: string;
  avatar: string;
  bio: string;
  isFriend?: boolean;
}
