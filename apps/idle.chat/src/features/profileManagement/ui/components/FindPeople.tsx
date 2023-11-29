import {
  Button,
  ConfigProvider,
  Divider,
  Dropdown,
  Input,
  Layout,
  List,
  Space,
  Spin,
  Typography,
  theme,
} from 'antd';
import UserCard from 'components/UserCard';
import FindUserByNameUseCase from 'features/profileManagement/useCases/findUserByName';
import React, {
  KeyboardEvent,
  cloneElement,
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
} from 'react';
import { useDebounce } from 'use-debounce';
import useClickOutsideListener from 'hooks/useClickOutsideListener';
import { FindUserSingleResponseDTO } from 'dto/socialDto';
import { SearchResultCard } from './SearchResult';
import SearchResultModal from './SearchResultModal';

const { useToken } = theme;

async function fetchUsersWithSimilarName(
  query: string,
  cancelSignal: AbortSignal,
  resolve: (result: SearchUserResult[]) => void,
) {
  const usecase = new FindUserByNameUseCase();
  const result = await usecase.execute({
    q: query,
    abortSignal: cancelSignal,
  });

  resolve(result);
}

type SearchUserResult = FindUserSingleResponseDTO;

export function FindPeople() {
  const { token } = useToken();

  const [nameQuery, setNameQuery] = useState<string>();
  const [searching, setSearching] = useState(false);
  const [delayedQuery] = useDebounce(nameQuery, 300);

  // search suggestions state
  const [resultSuggestionOpen, setResultSuggestionOpen] = useState(false);
  const [searchSuggestions, setSearchSuggestions] = useState<
    SearchUserResult[]
  >([]);

  // search results
  const [searchResult, setSearchResult] = useState<SearchUserResult[]>([]);
  // selected user to view profile
  const [userProfileToView, setUserProfileToView] = useState<
    SearchUserResult | undefined
  >();

  // reference to suggestion popup
  const suggestionPopupRef = useRef<HTMLDivElement>(null);
  useClickOutsideListener(
    suggestionPopupRef,
    useCallback(() => {
      setResultSuggestionOpen(false);
    }, []),
  );

  // when user press enter or press search button manually
  const onSearch = async (query: string) => {
    setResultSuggestionOpen(false);
    // TODO:
    // search for user
    // return more detailed user information

    // fake feature with current search suggestions
    await fetchUsersWithSimilarName(
      query,
      new AbortController().signal,
      setSearchResult,
    );
  };

  const onPressEnter = (e: KeyboardEvent<HTMLInputElement>) => {
    const searchElm = e.target as HTMLInputElement;
    const searchText = searchElm.value;

    onSearch(searchText);
  };

  // get search suggestions after user typed 300ms
  useEffect(() => {
    const abortSignal = new AbortController();
    if (delayedQuery && delayedQuery.trim().length > 0) {
      setSearching(true);

      fetchUsersWithSimilarName(
        delayedQuery ?? '',
        abortSignal.signal,
        setSearchSuggestions,
      ).finally(() => setSearching(false));
    } else {
      setSearchSuggestions([]);
      setResultSuggestionOpen(false);
    }
    return () => {
      abortSignal.abort();
    };
  }, [delayedQuery]);

  const contentStyle: React.CSSProperties = {
    backgroundColor: token.colorBgElevated,
    borderRadius: token.borderRadiusLG,
    boxShadow: token.boxShadowSecondary,
    cursor: 'pointer',
  };

  // hide suggestion popup conditions derived from component state
  const hasAnySearchSuggestions = searchSuggestions.length > 0;
  const didUserTyped = !!nameQuery;

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
          <div ref={suggestionPopupRef}>
            <Dropdown
              getPopupContainer={() =>
                suggestionPopupRef.current as HTMLDivElement
              }
              trigger={[]}
              open={resultSuggestionOpen}
              placement="bottom"
              arrow={false}
              menu={{
                style: {
                  maxHeight: 320,
                  overflow: 'auto',
                },
                items: searchSuggestions.map((user) => ({
                  key: user.name,
                  label: (
                    <UserCard
                      name={user.name}
                      userName={user.name}
                      avatar={user.avatar}
                    />
                  ),
                  'data-testid': 'find-people-suggestion-item',
                })),
                onClick: ({ key }) => {
                  // find user to select
                  const profileToView = searchSuggestions.find(
                    (suggestion) => suggestion.name === key,
                  );
                  setUserProfileToView(profileToView);
                  setResultSuggestionOpen(false);
                },
              }}
              // eslint-disable-next-line react/no-unstable-nested-components
              dropdownRender={(menu) => (
                <div
                  style={contentStyle}
                  data-testid="find-people-suggestion-popup"
                >
                  <Space
                    className="w-full justify-between hover:font-semibold"
                    onClick={() => {
                      if (nameQuery) onSearch(nameQuery);
                    }}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && nameQuery) {
                        onSearch(nameQuery);
                      }
                    }}
                  >
                    <Space style={{ padding: 8 }}>
                      <Typography.Text strong>Search: </Typography.Text>
                      <Typography.Text data-testid="find-people-search-phrase">
                        {nameQuery}
                      </Typography.Text>
                    </Space>
                    {searching ? <Spin size="small" className="mr-4" /> : null}
                  </Space>
                  <Divider style={{ margin: 0 }} />
                  {cloneElement(menu as React.ReactElement)}
                </div>
              )}
            >
              <Input
                data-testid="search-people-input"
                onKeyDown={(e) => {
                  // open popup when user is typing
                  if (!resultSuggestionOpen) setResultSuggestionOpen(true);
                  if (e.key === 'Enter') onPressEnter(e);
                }}
                spellCheck={false}
                onFocus={() => {
                  setResultSuggestionOpen(
                    didUserTyped || hasAnySearchSuggestions,
                  );
                }}
                onClick={() => {
                  if (nameQuery) setResultSuggestionOpen(true);
                }}
                onChange={(e) => {
                  setNameQuery(e.target.value);
                }}
                size="large"
                placeholder="Search for people"
              />
            </Dropdown>
          </div>

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
                    friendList &&
                    friendList.length <= FRIEND_LIST_MAX_LENGTH ? (
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
                    <SearchResultCard
                      onClick={() => {
                        setUserProfileToView(item);
                      }}
                      name={item.name}
                      avatar={item.avatar ?? ''}
                      key={item.name}
                      bio={item.bio ?? ''}
                      isFriend={item.isFriend}
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
                    <SearchResultCard
                      onClick={() => {
                        setUserProfileToView(item);
                      }}
                      name={item.name}
                      avatar={item.avatar ?? ''}
                      key={item.name}
                      bio={item.bio ?? ''}
                      isFriend={item.isFriend}
                      hasPendingRequest={item.hasPendingRequest}
                    />
                  )}
                />
              </div>
            </ConfigProvider>
          ) : null}
        </div>
      </Layout.Content>

      <SearchResultModal
        name={userProfileToView?.name ?? ''}
        bio={userProfileToView?.bio ?? ''}
        avatar={userProfileToView?.avatar ?? ''}
        isFriend
        modalProps={{
          open: shouldOpenProfileViewModal,
          onCancel: () => setUserProfileToView(undefined),
        }}
      />
    </Layout>
  );
}

// react-router dom convention
export function Component() {
  return <FindPeople />;
}
