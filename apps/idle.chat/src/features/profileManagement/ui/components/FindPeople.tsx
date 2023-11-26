import {
  Avatar,
  Button,
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
  useMemo,
  useState,
  useRef,
  useEffect,
  RefObject,
  MouseEvent,
  MutableRefObject,
  useCallback,
} from 'react';
import { useDebounce } from 'use-debounce';

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

type SearchResultCardProps = {
  name: string;
  avatar: string;
  isFriend?: boolean;
  bio: string;
};

function SearchResultCard({
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
/**
 * Hook that alerts clicks outside of the passed ref
 * @param ref element to watch
 * @param onClickOutside callback function called when click outside element
 */
function useClickOutsideListener(
  ref: MutableRefObject<HTMLElement | null>,
  onClickOutside: () => void,
) {
  useEffect(() => {
    /**
     * Alert if clicked on outside of element
     */
    function handleClickOutside(event: MouseEvent<Document>) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        onClickOutside();
      }
    }
    // Bind the event listener
    document.addEventListener('mousedown', handleClickOutside as any);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener('mousedown', handleClickOutside as any);
    };
  }, [ref, onClickOutside]);
}

export function FindPeople() {
  const { token } = useToken();

  const [nameQuery, setNameQuery] = useState<string>();
  const [searching, setSearching] = useState(false);
  const [delayedQuery] = useDebounce(nameQuery, 300);

  // search suggestions state
  const [resultSuggestionOpen, setResultSuggestionOpen] = useState(false);
  const [searchSuggestions, setSearchSuggestions] = useState<any[]>([]);

  // search results
  const [searchResult, setSearchResult] = useState<any[]>([]);

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

  // hide suggestion popup conditions
  const hasAnySearchSuggestions = searchSuggestions.length > 0;
  const didUserTyped = !!nameQuery;

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
                })),
              }}
              // eslint-disable-next-line react/no-unstable-nested-components
              dropdownRender={(menu) => (
                <div style={contentStyle}>
                  <Space
                    className="w-full justify-between hover:font-semibold"
                    onClick={(e) => {
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
                      <Typography.Text>{nameQuery}</Typography.Text>
                    </Space>
                    {searching ? <Spin size="small" className="mr-4" /> : null}
                  </Space>
                  <Divider style={{ margin: 0 }} />
                  {cloneElement(menu as React.ReactElement)}
                </div>
              )}
            >
              <Input
                onKeyDown={(e) => {
                  if (e.key === 'Enter') onPressEnter(e);
                }}
                spellCheck={false}
                onFocus={() =>
                  setResultSuggestionOpen(
                    didUserTyped || hasAnySearchSuggestions,
                  )
                }
                onClick={() => {
                  if (nameQuery) setResultSuggestionOpen(true);
                }}
                onChange={(e) => setNameQuery(e.target.value)}
                size="large"
                placeholder="Search for people"
              />
            </Dropdown>
          </div>

          {/* search results */}
          <List
            dataSource={searchResult}
            renderItem={(item, index) => (
              <SearchResultCard
                name={item.name}
                avatar={item.avatar}
                key={item.name}
                bio={item.status}
                isFriend
              />
            )}
          />
        </div>
      </Layout.Content>
    </Layout>
  );
}

// react-router dom convention
export function Component() {
  return <FindPeople />;
}
