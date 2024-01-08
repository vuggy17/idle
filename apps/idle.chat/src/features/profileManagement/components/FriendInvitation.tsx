import {
  Alert,
  Button,
  Card,
  ConfigProvider,
  Flex,
  Layout,
  List,
  Result,
  Typography,
  theme,
} from 'antd';
import { Suspense, useState } from 'react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { Await, LoaderFunction, useNavigate } from 'react-router-dom';
import { useLoaderData, defer } from 'react-router-typesafe';
import { Refresh } from 'iconoir-react';
import { FriendRequestResponseDTO, ID } from '@idle/model';
import PartialAvatar from '../../../components/UserCard/PartialAvatar';
import GetPendingFriendRequestUseCase from '../useCases/getPendingFriendRequests';
import ModifyFriendRequestUseCase from '../useCases/modifyFriendRequest';
import FriendRequestButton, {
  FriendRequestActions,
} from './FriendRequestButton';

dayjs.extend(relativeTime);

type FriendRequest = FriendRequestResponseDTO;

function FriendInvitation() {
  const data = useLoaderData<typeof Loader>();
  const navigate = useNavigate();

  const [errorMsg, setErrorMsg] = useState('');
  const acceptFriendRequest = async (requestId: ID) => {
    const executor = new ModifyFriendRequestUseCase();
    await executor.execute({
      requestId,
      action: 'accept',
    });
  };

  const deleteFriendRequest = async (requestId: ID) => {
    const executor = new ModifyFriendRequestUseCase();
    await executor.execute({ requestId, action: 'decline' });
  };

  const onAcceptOrDeclineError = (error: unknown) => {
    setErrorMsg((error as Error).message);
  };

  const shouldDisableRequestList = !!errorMsg;
  return (
    <Layout>
      <ConfigProvider
        theme={{
          components: {
            Card: {
              paddingLG: 36,
            },
          },
        }}
      >
        <Layout.Content>
          <div className="max-w-5xl mx-auto mt-36">
            <Typography.Title level={4}>
              Your pending invitations
            </Typography.Title>
            {errorMsg && (
              <Alert
                type="error"
                message={errorMsg}
                banner
                className="mb-2"
                action={
                  <Button
                    onClick={() => navigate(0)}
                    size="small"
                    type="link"
                    icon={
                      <Refresh
                        height={14}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          verticalAlign: '-.2em',
                        }}
                      />
                    }
                  >
                    refresh page
                  </Button>
                }
              />
            )}
            <Suspense fallback={<InvitationListFallback />}>
              <Await
                resolve={data.requests}
                errorElement={
                  <div data-testid="friend-invitation_error">
                    <Result
                      status="500"
                      title="500"
                      subTitle="Sorry, something went wrong."
                      extra={
                        <Button type="primary" onClick={() => navigate(0)}>
                          Try again
                        </Button>
                      }
                    />
                  </div>
                }
              >
                {(requests) => (
                  <List<FriendRequest>
                    data-testid="friend-invitation_list"
                    loading={
                      shouldDisableRequestList
                        ? {
                            indicator: <span />,
                            spinning: true,
                          }
                        : false
                    }
                    grid={{
                      gutter: 16,
                      xs: 1,
                      xl: 2,
                      xxl: 3,
                    }}
                    dataSource={requests}
                    itemLayout="horizontal"
                    renderItem={({ sender, updatedAt, ...request }) => (
                      <FriendRequestCard
                        title={sender.name}
                        avatar={sender.avatar}
                        description={dayjs.unix(updatedAt).fromNow()}
                        onAccept={() => acceptFriendRequest(request.id)}
                        onDelete={() => deleteFriendRequest(request.id)}
                        onError={onAcceptOrDeclineError}
                      />
                    )}
                  />
                )}
              </Await>
            </Suspense>
          </div>
        </Layout.Content>
      </ConfigProvider>
    </Layout>
  );
}

const { useToken } = theme;
function FriendRequestCard({
  title,
  description,
  avatar,
  onAccept,
  onDelete,
  loading = false,
  onError,
}: {
  title: string;
  description?: string;
  avatar?: string;
  loading?: boolean;
  onAccept?: () => Promise<void>;
  onDelete?: () => Promise<void>;
  onError?: (error: unknown) => void;
}) {
  const { token } = useToken();
  const [hasError, setHasError] = useState(false);

  const handleFriendRequestClicked = async (
    action: FriendRequestActions,
    resetState: (error: unknown) => void,
  ) => {
    try {
      switch (action) {
        case 'ACCEPT':
          await onAccept?.();
          break;
        case 'DECLINE':
          await onDelete?.();
          break;
        default:
          console.error('Action do not support: ', action);
      }
    } catch (error) {
      setHasError(true);
      resetState(error);
      onError?.(error);
    }
  };

  const errorStyle: React.CSSProperties = {
    borderColor: token.colorError,
  };
  return (
    <List.Item>
      <Card loading={loading} style={hasError ? errorStyle : undefined}>
        <Flex gap={12} vertical className="w-full">
          <Flex gap={16} align="center">
            <PartialAvatar
              size={58}
              shape="square"
              src={avatar || title}
              className="shrink-0"
            />
            <div>
              <Typography.Text strong className="block text-lg line-clamp-1">
                {title}
              </Typography.Text>
              <Typography.Text type="secondary" className="line-clamp-1">
                {description}
              </Typography.Text>
            </div>
          </Flex>
          <div className="h-12" />
          <div className="text-right">
            <FriendRequestButton
              currentUserIsSender={false}
              initialState="pending"
              onClick={handleFriendRequestClicked}
            />
          </div>
        </Flex>
      </Card>
    </List.Item>
  );
}

function InvitationListFallback() {
  const requests = Array(6).fill(0);
  return (
    <List<FriendRequest>
      grid={{
        gutter: 16,
        xs: 1,
        xl: 2,
        xxl: 3,
      }}
      dataSource={requests}
      itemLayout="horizontal"
      renderItem={(item) => (
        <FriendRequestCard
          loading
          title="title"
          avatar="avatar"
          description={dayjs.unix(item.createdAt).fromNow()}
        />
      )}
    />
  );
}

// eslint-disable-next-line import/prefer-default-export
export function Component() {
  return <FriendInvitation />;
}

export const Loader = (async () => {
  const executor = new GetPendingFriendRequestUseCase();
  return defer({
    requests: executor.execute(),
  });
}) satisfies LoaderFunction;
