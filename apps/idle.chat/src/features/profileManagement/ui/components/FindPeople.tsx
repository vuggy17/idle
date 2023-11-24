import {
  Divider,
  Dropdown,
  Flex,
  Input,
  Layout,
  Space,
  Spin,
  Tooltip,
  Typography,
  theme,
} from 'antd';
import UserCard from 'components/UserCard';
import FindUserByNameUseCase from 'features/profileManagement/useCases/findUserByName';
import { cloneElement, useEffect, useState } from 'react';
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

function SearchResultCard() {
  // return <div></div>
}

export function FindPeople() {
  const { token } = useToken();

  const [nameQuery, setNameQuery] = useState<string>();
  const [searching, setSearching] = useState(false);
  const [delayedQuery] = useDebounce(nameQuery, 300);

  // search suggestions
  const [resultSuggestionOpen, setResultSuggestionOpen] = useState(false);
  const [searchSuggestions, setSearchSuggestions] = useState<any[]>([]);

  // search results
  const [searchResult, setSearchResult] = useState<any[]>([]);

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

  const hasAnySearchSuggestions = searchSuggestions.length > 0;
  const didUserTyped = !!nameQuery;

  return (
    <Layout>
      <Layout.Content>
        <div className="max-w-5xl mx-auto mt-36 px-20">
          {/* search input */}
          <Typography.Title level={4}>All people</Typography.Title>
          <Dropdown
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
              <div style={contentStyle} className="hover:font-semibold">
                <Space className="w-full justify-between">
                  <Space style={{ padding: 8 }}>
                    <Typography.Text strong>Search: </Typography.Text>
                    <Typography.Text>{nameQuery}</Typography.Text>
                  </Space>
                  {searching ? <Spin size="small" className="mr-4" /> : null}
                </Space>
                <Divider style={{ margin: 0 }} />
                {cloneElement(menu as React.ReactElement, {
                  borderRadius: 0,
                })}
              </div>
            )}
          >
            <Input
              spellCheck={false}
              onBlur={() => setResultSuggestionOpen(false)}
              onFocus={() =>
                setResultSuggestionOpen(didUserTyped || hasAnySearchSuggestions)
              }
              onChange={(e) => setNameQuery(e.target.value)}
              size="large"
              placeholder="Search for people"
            />
          </Dropdown>

          {/* results */}
        </div>
      </Layout.Content>
    </Layout>
  );
}

// react-router dom convention
export function Component() {
  return <FindPeople />;
}
