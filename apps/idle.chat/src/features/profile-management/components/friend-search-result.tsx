import { Button } from 'antd';
import { CommonSearchResult, SearchResultCardProps } from './search-result';

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
