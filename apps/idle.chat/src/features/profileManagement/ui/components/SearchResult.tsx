import { Avatar, Button, List, Tooltip } from 'antd';
import { Check, UserPlus } from 'iconoir-react';
import { useMemo, MouseEvent, useState } from 'react';

type ListItemProps = (typeof List)['Item']['defaultProps'];

export function SearchResultCard({
  name,
  avatar,
  bio,
  isFriend = false,
  hasPendingRequest = false,
  ...listItemProps
}: SearchResultCardProps) {
  const [doesFriendRequestSent, setDoesFriendRequestSent] =
    useState(hasPendingRequest);

  const onCancelFriendRequest = (e: MouseEvent<HTMLButtonElement>) => {
    setDoesFriendRequestSent(false);
    // cancel friend request
    e.stopPropagation();
  };

  const onAddFriend = (e: MouseEvent<HTMLButtonElement>) => {
    setDoesFriendRequestSent(true);
    // send friend request
    e.stopPropagation();
  };

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

  const resultAction = useMemo(() => {
    if (isFriend) {
      return (
        <Button data-testid="find-people-result-action-btn">Message</Button>
      );
    }
    if (doesFriendRequestSent) {
      return (
        <Tooltip title="Press again to cancel">
          <Button
            data-testid="find-people-result-action-btn"
            type="link"
            onClick={onCancelFriendRequest}
            icon={
              <Check
                height={18}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  verticalAlign: '-.2em',
                }}
              />
            }
          >
            Invitation sent
          </Button>
        </Tooltip>
      );
    }
    return (
      <Button
        data-testid="find-people-result-action-btn"
        onClick={onAddFriend}
        icon={
          <UserPlus
            height={18}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              verticalAlign: '-.2em',
            }}
          />
        }
      >
        Add friend
      </Button>
    );
  }, [isFriend, doesFriendRequestSent]);

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
  bio: string;
  isFriend?: boolean;
  hasPendingRequest?: boolean;
} & ListItemProps;
