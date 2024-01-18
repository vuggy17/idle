import {
  Button,
  Flex,
  Image,
  Modal,
  ModalProps,
  Skeleton,
  Space,
  Tooltip,
  Typography,
  theme,
} from 'antd';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { ChatBubble, Check, UserPlus } from 'iconoir-react';
import { MouseEvent, memo, useEffect, useMemo, useState } from 'react';
import HttpProvider from '../../../providers/http';
import PartialAvatar from '../../../components/user-card/partial-avatar';

type SearchResult = {
  id: string;
  name: string;
  avatar?: string;
  bio?: string;
  isFriend?: boolean;
  hasPendingRequest?: boolean;
};

type SearchResultModalProps = SearchResult & {
  modalProps: ModalProps;
};

const tempProfileCover =
  'https://images.unsplash.com/photo-1541704328070-20bf4601ae3e?q=80&w=2340&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';

const { useToken } = theme;
function Component({ ...props }: SearchResultModalProps) {
  const { token } = useToken();
  const { modalProps, ...user } = props;
  const [profile, setProfile] = useState<SearchResult>({ ...user });
  const [doesFriendRequestSent, setDoesFriendRequestSent] = useState(
    user.hasPendingRequest,
  );

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

  useEffect(() => {
    const controller = new AbortController();
    if (user.isFriend === undefined) {
      HttpProvider.getSearchResultDetail(user.id, controller.signal).then(
        setProfile,
      );
    } else {
      setProfile({ ...user });
    }
    return () => {
      controller.abort();
    };
  }, [user.isFriend]);

  const profileActions = useMemo(() => {
    if (profile?.isFriend === undefined) {
      return <Skeleton.Button />;
    }
    if (profile.isFriend) {
      return (
        <Button
          icon={
            <ChatBubble
              height={18}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                verticalAlign: '-.2em',
              }}
            />
          }
        >
          Send message
        </Button>
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
  }, [profile.isFriend, doesFriendRequestSent]);

  return (
    <Modal {...modalProps} centered width={480} closeIcon={null} footer={null}>
      <div data-testid="find-people-profile-view-popup">
        {/* profile cover */}
        <div className="h-[200px]">
          <Image
            src={user.avatar ?? tempProfileCover}
            height="100%"
            width="100%"
            className="object-cover"
            style={{
              background: token.colorBgLayout,
            }}
          />
        </div>
        <div className="-my-10 pb-10">
          <Space
            direction="vertical"
            className="w-full justify-center relative items-center"
          >
            <PartialAvatar
              alt={user.name}
              size={96}
              shape="circle"
              src={user.avatar || tempProfileCover}
              className="shadow-lg "
              style={{
                background: token.colorBgElevated,
              }}
            />
            <Flex vertical className="text-center">
              <Typography.Text>{user.name}</Typography.Text>
              <Typography.Text type="secondary">{user.bio}</Typography.Text>
            </Flex>

            <div className="mt-3">{profileActions}</div>
          </Space>
        </div>
      </div>
    </Modal>
  );
}

const SearchResultModal = memo(
  Component,
  (prev, curr) =>
    prev.avatar === curr.avatar &&
    prev.bio === curr.bio &&
    prev.isFriend === curr.isFriend &&
    prev.name === curr.name,
);

export default SearchResultModal;
