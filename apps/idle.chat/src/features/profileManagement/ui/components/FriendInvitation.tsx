import {
  Alert,
  Avatar,
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
import { MouseEvent, Suspense, useMemo, useState } from 'react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { Await, LoaderFunction, useNavigate } from 'react-router-dom';
import { useLoaderData, defer } from 'react-router-typesafe';
import GetPendingFriendRequestUseCase from '@idle/chat/features/profileManagement/useCases/getPendingFriendRequests';
import ModifyFriendRequestUseCase from '@idle/chat/features/profileManagement/useCases/modifyFriendRequest';
import { Refresh } from 'iconoir-react';

dayjs.extend(relativeTime);

type FriendRequest = {
  id: string;
  name: string;
  avatar: string;
  createdAt: number;
  isAccepted: boolean;
};

const mockRequestList: FriendRequest[] = [
  {
    id: '01HGD4JGY8992WDQRV6S1RJD8Q',
    name: 'Bert Gallacher',
    avatar: 'https://randomuser.me/api/portraits/men/18.jpg',
    isAccepted: true,
    createdAt: 1676155770,
  },
  {
    id: '01HGD4JGY9842H30NZ5MXZH43Z',
    name: 'Evvie Hoofe',
    avatar: 'https://randomuser.me/api/portraits/men/18.jpg',
    isAccepted: false,
    createdAt: 1675518787,
  },
  {
    id: '01HGD4JGYAMZ3T2CHZH6E7185J',
    name: 'Romola Walesa',
    avatar: 'https://randomuser.me/api/portraits/men/18.jpg',
    isAccepted: true,
    createdAt: 1683131758,
  },
  {
    id: '01HGD4JGYCG72XYPMVA2058H39',
    name: 'Lynnet McGuiney',
    avatar: 'https://randomuser.me/api/portraits/men/18.jpg',
    isAccepted: false,
    createdAt: 1695450104,
  },
  {
    id: '01HGD4JGYD94XZBCH259XC6D9A',
    name: 'Karlee Allmond',
    avatar: 'https://randomuser.me/api/portraits/men/18.jpg',
    isAccepted: false,
    createdAt: 1687655918,
  },
  {
    id: '01HGD4JGYEGDRA30XM8T81SJVJ',
    name: 'Dulcine Lavington',
    avatar: 'https://randomuser.me/api/portraits/men/18.jpg',
    isAccepted: true,
    createdAt: 1677327436,
  },
  {
    id: '01HGD4JGYFPN5RAMPK0N7SYQDT',
    name: 'Lynnette Rainsbury',
    avatar: 'https://randomuser.me/api/portraits/men/18.jpg',
    isAccepted: true,
    createdAt: 1692382620,
  },
  // {
  //   id: '01HGD4JGYGG9Y8YWWZ95F99HF3',
  //   name: 'Tanya Crecy',
  //   avatar: 'https://randomuser.me/api/portraits/men/18.jpg',
  //   isAccepted: false,
  //   createdAt: 1673138330,
  // },
  // {
  //   id: '01HGD4JGYHJQNK0Q2WJ0VC4KBZ',
  //   name: 'Clemens Bythway',
  //   avatar: 'https://randomuser.me/api/portraits/men/18.jpg',
  //   isAccepted: true,
  //   createdAt: 1681555560,
  // },
  // {
  //   id: '01HGD4JGYJ14AF05XRCPX07GVV',
  //   name: 'Rosemary Moncreiffe',
  //   avatar: 'https://randomuser.me/api/portraits/men/18.jpg',
  //   isAccepted: true,
  //   createdAt: 1676727133,
  // },
  // {
  //   id: '01HGD4JGYKC4300MBPQ5BNRR6K',
  //   name: 'Elva Belle',
  //   avatar: 'https://randomuser.me/api/portraits/men/18.jpg',
  //   isAccepted: true,
  //   createdAt: 1686579978,
  // },
  // {
  //   id: '01HGD4JGYM9GDMH30HAN5W9ZY1',
  //   name: 'Harriot Connaughton',
  //   avatar: 'https://randomuser.me/api/portraits/men/18.jpg',
  //   isAccepted: true,
  //   createdAt: 1683799894,
  // },
  // {
  //   id: '01HGD4JGYNSDAAAGKQC23BXX7P',
  //   name: 'Olvan Scupham',
  //   avatar: 'https://randomuser.me/api/portraits/men/18.jpg',
  //   isAccepted: false,
  //   createdAt: 1671924814,
  // },
  // {
  //   id: '01HGD4JGYPYCA5PVKJTZHBCJB5',
  //   name: 'Johanna Ricardin',
  //   avatar: 'https://randomuser.me/api/portraits/men/18.jpg',
  //   isAccepted: true,
  //   createdAt: 1700748365,
  // },
  // {
  //   id: '01HGD4JGYQT940YPT7FYYA2DMB',
  //   name: 'Malchy Karslake',
  //   avatar: 'https://randomuser.me/api/portraits/men/18.jpg',
  //   isAccepted: true,
  //   createdAt: 1684618859,
  // },
  // {
  //   id: '01HGD4JGYRFWCJJVQ8GRPYAYDC',
  //   name: 'Davina Bowlands',
  //   avatar: 'https://randomuser.me/api/portraits/men/18.jpg',
  //   isAccepted: true,
  //   createdAt: 1676562973,
  // },
  // {
  //   id: '01HGD4JGYS6TPHN7TXRX1YJT1T',
  //   name: 'Faber Scholz',
  //   avatar: 'https://randomuser.me/api/portraits/men/18.jpg',
  //   isAccepted: true,
  //   createdAt: 1690804252,
  // },
  // {
  //   id: '01HGD4JGYTS7BG1013KVPXBHR4',
  //   name: 'Farrah Diggles',
  //   avatar: 'https://randomuser.me/api/portraits/men/18.jpg',
  //   isAccepted: false,
  //   createdAt: 1683170049,
  // },
  // {
  //   id: '01HGD4JGYVG5MJWRR5786FMJ4V',
  //   name: 'Barnard Tomaschke',
  //   avatar: 'https://randomuser.me/api/portraits/men/18.jpg',
  //   isAccepted: false,
  //   createdAt: 1680163437,
  // },
  // {
  //   id: '01HGD4JGYXAV28T6AM4PJ996H3',
  //   name: 'Guglielma Digg',
  //   avatar: 'https://randomuser.me/api/portraits/men/18.jpg',
  //   isAccepted: true,
  //   createdAt: 1676676111,
  // },
  // {
  //   id: '01HGD4JGYY7HKQ8BX8N8PT8H7P',
  //   name: 'Marie-jeanne Burbridge',
  //   avatar: 'https://randomuser.me/api/portraits/men/18.jpg',
  //   isAccepted: true,
  //   createdAt: 1701013730,
  // },
  // {
  //   id: '01HGD4JGYZCDSSY341HK68GCA4',
  //   name: 'Judah Verillo',
  //   avatar: 'https://randomuser.me/api/portraits/men/18.jpg',
  //   isAccepted: true,
  //   createdAt: 1670873982,
  // },
  // {
  //   id: '01HGD4JGZ01QBM9S5DPGJ9BYAV',
  //   name: 'Niall Richardeau',
  //   avatar: 'https://randomuser.me/api/portraits/men/18.jpg',
  //   isAccepted: true,
  //   createdAt: 1674188484,
  // },
];

function FriendInvitation() {
  const data = useLoaderData<typeof Loader>();
  const navigate = useNavigate();

  const [errorMsg, setErrorMsg] = useState('');
  const acceptFriendRequest = async (requestId: string) => {
    const executor = new ModifyFriendRequestUseCase();
    await executor.execute({ requestId, action: 'accept' });
  };

  const deleteFriendRequest = async (requestId: string) => {
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
                    renderItem={(item) => (
                      <FriendRequestCard
                        title={item.name}
                        avatar={item.avatar}
                        description={dayjs.unix(item.createdAt).fromNow()}
                        onAccept={() => acceptFriendRequest(item.id)}
                        onDelete={() => deleteFriendRequest(item.id)}
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
  onAccept?: (e: MouseEvent<HTMLButtonElement>) => Promise<void>;
  onDelete?: (e: MouseEvent<HTMLButtonElement>) => Promise<void>;
  onError?: (error: unknown) => void;
}) {
  const { token } = useToken();

  const [status, setStatus] = useState<'accepted' | 'deleted' | 'unset'>(
    'unset',
  );
  const [hasError, setHasError] = useState(false);

  const onAcceptClick = async (e: MouseEvent<HTMLButtonElement>) => {
    try {
      setStatus('accepted');
      await onAccept?.(e);
    } catch (error) {
      setStatus('unset');
      setHasError(true);
      onError?.(error);
    }
  };
  const onDeleteClick = (e: MouseEvent<HTMLButtonElement>) => {
    try {
      setStatus('deleted');
      onDelete?.(e);
    } catch (error) {
      setStatus('unset');
      setHasError(true);
      onError?.(error);
    }
  };

  const footer = useMemo(() => {
    switch (status) {
      case 'accepted':
        return (
          <Button
            type="text"
            block
            disabled
            data-testid="friend-invitation__accept--accepted"
          >
            Accepted friend request
          </Button>
        );
      case 'deleted':
        return (
          <Button
            type="text"
            block
            disabled
            data-testid="friend-invitation__delete--deleted"
          >
            Deleted
          </Button>
        );
      default:
        return (
          <Flex className="w-full" gap={8}>
            <Button
              type="primary"
              block
              onClick={onAcceptClick}
              data-testid="friend-invitation__accept"
            >
              Accept
            </Button>
            <Button
              block
              onClick={onDeleteClick}
              data-testid="friend-invitation__delete"
            >
              Delete
            </Button>
          </Flex>
        );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  const errorStyle: React.CSSProperties = {
    borderColor: token.colorError,
  };
  return (
    <List.Item>
      <Card loading={loading} style={hasError ? errorStyle : undefined}>
        <Flex gap={12} vertical className="w-full">
          <Flex gap={16} align="center">
            <Avatar
              size={58}
              shape="square"
              src={avatar}
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
          {footer}
        </Flex>
      </Card>
    </List.Item>
  );
}

function InvitationListFallback() {
  const requests = mockRequestList;
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
          title={item.name}
          avatar={item.avatar}
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