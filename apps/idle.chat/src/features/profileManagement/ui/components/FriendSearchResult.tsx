import { Button } from 'antd';
import { CommonSearchResult, SearchResultCardProps } from './SearchResult';

interface FriendSearchResultProps extends SearchResultCardProps {
  onMessageClick?: () => void;
}

export default function FriendSearchResult({
  onMessageClick,
  ...listItemProps
}: FriendSearchResultProps) {
  return (
    <CommonSearchResult
      {...listItemProps}
      actions={[]}
    />
  );
}
