import {
  Card,
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
} from 'react';
import { useDebounce } from 'use-debounce';
import useClickOutsideListener from 'hooks/useClickOutsideListener';
import { SearchResultCard } from './SearchResult';
import SearchResultModal from './SearchResultModal';

const { useToken } = theme;

async function fetchUsersWithSimilarName(
  query: string,
  cancelSignal: AbortSignal,
  resolve: (result: unknown[]) => void,
) {
  const usecase = new FindUserByNameUseCase();
  const result = await usecase.execute({
    q: query,
    abortSignal: cancelSignal,
  });

  resolve(result);
}

type SearchUserResult = any;

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
  const [userProfileToView, setUserProfileToView] =
    useState<SearchUserResult | null>(null);

  // reference to suggestion popup
  const suggestionPopupRef = useRef<HTMLDivElement>(null);
  useClickOutsideListener(
    suggestionPopupRef,
    useCallback(() => {
      setResultSuggestionOpen(false);
    }, []),
  );

  // when user press enter or press search button manually
  const onSearch = (query: string) => {
    setResultSuggestionOpen(false);
    // TODO:
    // search for user
    // return more detailed user information

    // fake feature with current search suggestions
    setSearchResult(searchSuggestions);
  };

  const onPressEnter = (e: KeyboardEvent<HTMLInputElement>) => {
    const searchElm = e.target as HTMLInputElement;
    const searchText = searchElm.value;

    onSearch(searchText);
  };

  // get search suggestions after user typed 300ms
  useEffect(() => {
    setSearching(true);

    const abortSignal = new AbortController();
    fetchUsersWithSimilarName(
      delayedQuery ?? '',
      abortSignal.signal,
      setSearchSuggestions,
    ).finally(() => setSearching(false));

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

          {/* search results */}
          <div
            style={{
              paddingInline: token.paddingLG,
              backgroundColor: token.colorBgElevated,
              borderRadius: token.borderRadiusLG,
            }}
            className="mt-4"
          >
            <List
              dataSource={searchResult}
              renderItem={(item) => (
                <SearchResultCard
                  onClick={() => {
                    setUserProfileToView(item);
                  }}
                  name={item.name}
                  avatar={item.avatar}
                  key={item.name}
                  bio={item.status}
                  isFriend
                />
              )}
            />
          </div>
        </div>
      </Layout.Content>

      <SearchResultModal
        name="Naruto"
        bio="@naruto so strong! 👀💪✈️"
        isFriend
        modalProps={{
          open: shouldOpenProfileViewModal,
          onCancel: () => setUserProfileToView(null),
        }}
      />
    </Layout>
  );
}

// react-router dom convention
export function Component() {
  return <FindPeople />;
}
