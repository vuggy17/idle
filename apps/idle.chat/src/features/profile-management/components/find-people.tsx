import {
  Button,
  ConfigProvider,
  Layout,
  List,
  Space,
  Typography,
  theme,
} from 'antd';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { useDebounce } from 'use-debounce';
import {
  GetUserSearchResultResponseDTO,
  GetUserSearchSuggestionResponseDTO,
  ID,
} from '@idle/model';
import { PartialBy } from '../../../type';
import SearchWithPopup from '../../../components/search-with-popup/search-with-popup';
import UserCard from '../../../components/user-card';
import SearchResultModal from './search-result-modal';
import GetUserSearchResultUseCase from '../use-cases/get-user-search-result';
import PeopleSearchResult from './people-search-result';
import FriendSearchResult from './friend-search-result';
import GetUserSearchSuggestionUseCase from '../use-cases/get-user-search-suggestion';

const { useToken } = theme;
async function getSearchSuggestions(
  query: string,
  cancelSignal: AbortSignal,
  resolve: (result: GetUserSearchSuggestionResponseDTO) => void,
) {
  const usecase = new GetUserSearchSuggestionUseCase();
  const result = await usecase.execute({
    q: query,
    abortSignal: cancelSignal,
  });

  resolve(result);
}

async function getSearchResult(
  query: string,
  cancelSignal: AbortSignal,
  resolve: (result: GetUserSearchResultResponseDTO) => void,
) {
  const usecase = new GetUserSearchResultUseCase();
  const result = await usecase.execute({
    q: query,
    abortSignal: cancelSignal,
  });

  resolve(result);
}

export function FindPeople() {
  const { token } = useToken();

  const [nameQuery, setNameQuery] = useState<string>();
  const [searching, setSearching] = useState(false);
  const [delayedQuery] = useDebounce(nameQuery, 300);

  // search suggestions state
  const [searchSuggestions, setSearchSuggestions] =
    useState<GetUserSearchSuggestionResponseDTO>([]);

  // search results
  const [searchResult, setSearchResult] =
    useState<GetUserSearchResultResponseDTO>([]);
  // selected user to view profile
  const [userProfileToView, setUserProfileToView] = useState<
    | PartialBy<
        GetUserSearchResultResponseDTO[number],
        'isFriend' | 'hasPendingRequest' | 'bio' | 'pendingFriendRequest'
      >
    | undefined
  >();

  // when user press enter or press search button manually
  const onSearch = async (query: string) => {
    await getSearchResult(query, new AbortController().signal, setSearchResult);
  };

  const onCloseProfileDetailView = useCallback(
    () => setUserProfileToView(undefined),
    [],
  );

  const onFriendRequestAccepted = useCallback((userId: ID) => {
    setSearchResult((allUsers) => {
      const user = allUsers.find((u) => u.id === userId);
      if (user) {
        user.isFriend = true;
        user.pendingFriendRequest = null;
        user.hasPendingRequest = false;
      }
      return [...allUsers];
    });
  }, []);

  // get search suggestions after user typed 300ms
  useEffect(() => {
    const abortSignal = new AbortController();
    if (delayedQuery && delayedQuery.trim().length > 0) {
      setSearching(true);

      getSearchSuggestions(
        delayedQuery ?? '',
        abortSignal.signal,
        setSearchSuggestions,
      ).finally(() => setSearching(false));
    } else {
      setSearchSuggestions([]);
    }
    return () => {
      abortSignal.abort();
    };
  }, [delayedQuery]);

  const shouldOpenProfileViewModal = !!userProfileToView;

  // categorized search results
  const FRIEND_LIST_MAX_LENGTH = 4;
  const [friendListMaxItemsCount, setFriendListMaxItemsCount] = useState(
    FRIEND_LIST_MAX_LENGTH,
  );
  const friendList = useMemo(() => {
    const friends = searchResult.filter(({ isFriend }) => isFriend);

    return friends.slice(0, Math.min(friendListMaxItemsCount, friends.length));
  }, [searchResult, friendListMaxItemsCount]);

  const people = useMemo(
    () => searchResult.filter(({ isFriend }) => !isFriend),
    [searchResult],
  );
  return (
    <Layout>
      <Layout.Content>
        <div className="max-w-5xl mx-auto mt-36 px-20">
          {/* search input */}
          <Typography.Title level={4}>All people</Typography.Title>

          <SearchWithPopup
            value={nameQuery}
            onChange={(query) => {
              setNameQuery(query);
            }}
            loading={searching}
            onSearch={onSearch}
            options={searchSuggestions.map((user) => ({
              key: user.name,
              label: (
                <UserCard
                  name={user.name}
                  userName={user.name}
                  avatar={user.avatar}
                />
              ),
              'data-testid': 'find-people-suggestion-item',
            }))}
            onItemClick={({ key }) => {
              const profileToView = searchSuggestions.find(
                (suggestion) => suggestion.name === key,
              );
              setUserProfileToView(profileToView);
            }}
          />

          {searchResult && searchResult.length > 0 ? (
            <ConfigProvider
              theme={{
                components: {
                  Button: {
                    linkHoverBg: token.colorBgTextHover,
                    colorLinkHover: token.colorLink,
                  },
                },
              }}
            >
              {/* search results - friend list */}
              <div
                style={{
                  paddingInline: token.paddingLG,
                  backgroundColor: token.colorBgElevated,
                  borderRadius: token.borderRadiusLG,
                }}
                className="mt-4"
              >
                <List
                  data-testid="find-people-friend-list"
                  footer={
                    friendList && friendList.length > FRIEND_LIST_MAX_LENGTH ? (
                      <div className="text-center">
                        <Button
                          block
                          type="link"
                          onClick={() => setFriendListMaxItemsCount(999)}
                        >
                          See all
                        </Button>
                      </div>
                    ) : null
                  }
                  header={
                    <Space className="py-3">
                      <span
                        aria-label="friend icon"
                        role="img"
                        className="rounded-lg p-2 text-base bg-[#e6d8ff]"
                      >
                        🙏
                      </span>
                      <Typography.Title
                        level={4}
                        style={{
                          margin: 0,
                        }}
                      >
                        Your friends
                      </Typography.Title>
                    </Space>
                  }
                  dataSource={friendList}
                  renderItem={(item) => (
                    <FriendSearchResult
                      id={item.id}
                      name={item.name}
                      avatar={item.avatar ?? ''}
                      key={item.name}
                      bio={item.bio ?? ''}
                      isFriend
                    />
                  )}
                />
              </div>

              {/* search results - stranger list */}
              <div
                style={{
                  paddingInline: token.paddingLG,
                  backgroundColor: token.colorBgElevated,
                  borderRadius: token.borderRadiusLG,
                }}
                className="mt-4"
              >
                <List
                  data-testid="find-people-people-list"
                  header={
                    <Space className="py-3">
                      <span
                        aria-label="friend icon"
                        role="img"
                        className="rounded-lg p-2 text-base bg-[#86b27b]"
                      >
                        🤷
                      </span>
                      <Typography.Title
                        level={4}
                        style={{
                          margin: 0,
                        }}
                      >
                        People
                      </Typography.Title>
                    </Space>
                  }
                  dataSource={people}
                  renderItem={(item) => (
                    <PeopleSearchResult
                      onFriendRequestAccepted={onFriendRequestAccepted}
                      id={item.id}
                      name={item.name}
                      avatar={item.avatar ?? ''}
                      key={item.name}
                      bio={item.bio ?? ''}
                      isFriend={item.isFriend}
                      hasPendingRequest={item.hasPendingRequest}
                      pendingFriendRequest={item.pendingFriendRequest}
                    />
                  )}
                />
              </div>
            </ConfigProvider>
          ) : null}
        </div>
      </Layout.Content>

      {userProfileToView && (
        <SearchResultModal
          key={userProfileToView.id}
          id={userProfileToView.id}
          name={userProfileToView.name ?? ''}
          bio={userProfileToView.bio ?? ''}
          avatar={userProfileToView.avatar ?? ''}
          isFriend={userProfileToView.isFriend}
          modalProps={{
            open: shouldOpenProfileViewModal,
            onCancel: onCloseProfileDetailView,
            destroyOnClose: true,
          }}
        />
      )}
    </Layout>
  );
}

// react-router dom convention
export function Component() {
  return <FindPeople />;
}
