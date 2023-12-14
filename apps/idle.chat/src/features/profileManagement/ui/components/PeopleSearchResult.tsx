import FriendRequestButton, {
  FriendRequestActions,
} from './FriendRequestButton';
import { useAtomValue } from 'jotai';
import { currentUserAtom } from '@idle/chat/store/user';
import { FriendRequestResponseDTO, ID } from '@idle/model';
import CreateFriendRequestUseCase from '../../useCases/createFriendRequest';
import ModifyFriendRequestUseCase from '../../useCases/modifyFriendRequest';
import { CommonSearchResult, SearchResultCardProps } from './SearchResult';
import { App } from 'antd';

interface PeopleSearchResultProps extends SearchResultCardProps {
  hasPendingRequest?: boolean;
  pendingFriendRequest: FriendRequestResponseDTO | null;
  onFriendRequestAccepted?: (requestId: ID) => void;
}

const { useApp } = App;

export default function PeopleSearchResult({
  isFriend = false,
  hasPendingRequest = false,
  pendingFriendRequest,
  onFriendRequestAccepted,
  ...listItemProps
}: PeopleSearchResultProps) {
  const { notification } = useApp();
  const { id } = listItemProps;
  const currentUser = useAtomValue(currentUserAtom);

  const cancelFriendRequest = async () => {
    await new ModifyFriendRequestUseCase().execute({
      action: 'cancel',
      requestId: pendingFriendRequest!.id,
    });
  };

  const acceptFriendRequest = async () => {
    await new ModifyFriendRequestUseCase().execute({
      action: 'accept',
      requestId: pendingFriendRequest!.id,
    });
    onFriendRequestAccepted?.(id);
  };

  const declineFriendRequest = async () => {
    await new ModifyFriendRequestUseCase().execute({
      action: 'decline',
      requestId: pendingFriendRequest!.id,
    });
  };

  const addFriend = async () => {
    await new CreateFriendRequestUseCase().execute({ receiver: id });
  };

  const handleFriendRequestClicked = async (
    action: FriendRequestActions,
    onError: (error: unknown) => void,
  ) => {
    try {
      switch (action) {
        case 'SEND':
          await addFriend();
          break;
        case 'ACCEPT':
          await acceptFriendRequest();
          break;
        case 'DECLINE':
          await declineFriendRequest();
          break;
        case 'CANCEL':
          await cancelFriendRequest();
          break;
        default:
          console.error('Friend request: Unknown action: ', action);
      }
    } catch (error) {
      onError(error);

      notification.error({
        message: JSON.stringify(
          error instanceof Error ? error.message : JSON.stringify(error),
        ),
      });
    }
  };

  return (
    <CommonSearchResult
      {...listItemProps}
      actions={[
        <FriendRequestButton
          onClick={handleFriendRequestClicked}
          initialState={
            pendingFriendRequest && pendingFriendRequest.status !== 'cancelled'
              ? pendingFriendRequest.status
              : 'initial'
          }
          currentUserIsSender={
            pendingFriendRequest
              ? pendingFriendRequest.sender.id === currentUser.id
              : true
          }
        />,
      ]}
    />
  );
}
