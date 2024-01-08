import { Button, Space } from 'antd';
import useStateHistory from '../../../hooks/useStateHistory';

type FriendRequestStates = 'initial' | 'pending' | 'accepted' | 'declined';
export type FriendRequestActions = 'SEND' | 'ACCEPT' | 'DECLINE' | 'CANCEL';

// state transition table for friend a request
const stateMachine: Record<
  FriendRequestStates,
  { on: Record<FriendRequestActions, FriendRequestStates> }
> = {
  initial: {
    on: {
      SEND: 'pending',
      ACCEPT: 'initial',
      DECLINE: 'initial',
      CANCEL: 'initial',
    },
  },
  pending: {
    on: {
      SEND: 'pending',
      ACCEPT: 'accepted',
      DECLINE: 'declined',
      CANCEL: 'initial',
    },
  },
  accepted: {
    on: {
      SEND: 'accepted',
      ACCEPT: 'accepted',
      DECLINE: 'accepted',
      CANCEL: 'accepted',
    },
  },
  declined: {
    on: {
      SEND: 'declined',
      ACCEPT: 'declined',
      DECLINE: 'declined',
      CANCEL: 'declined',
    },
  },
};

interface FriendRequestButtonProps {
  currentUserIsSender?: boolean;
  initialState?: 'initial' | 'pending' | 'accepted' | 'declined';
  /**
   * @param onError error handler if sending friend request failed
   */
  onClick?: (
    currState: FriendRequestActions,
    onError: (error: unknown) => void,
  ) => void;
}

export default function FriendRequestButton({
  currentUserIsSender = false,
  initialState = 'initial',
  onClick,
}: FriendRequestButtonProps) {
  const [state, setState, { undo }] = useStateHistory(initialState);

  const dispatch = (action: FriendRequestActions) => {
    const newState = stateMachine[state]?.on[action] || state;
    if (action === 'CANCEL' && !currentUserIsSender) {
      console.error('Only the sender can cancel the request');
      return;
    }
    setState(newState);
    onClick?.(action, resetState);
  };

  const resetState = (error: unknown) => {
    undo();
  };

  if (state === 'pending' && currentUserIsSender) {
    return (
      <Button
        data-testid="find-people-result-action-btn"
        onClick={() => dispatch('CANCEL')}
      >
        Cancel request
      </Button>
    );
  }

  switch (state) {
    case 'initial':
      return (
        <Button type="primary" onClick={() => dispatch('SEND')}>
          send request
        </Button>
      );
    case 'pending':
      return (
        <Space>
          <Button type="primary" onClick={() => dispatch('ACCEPT')}>
            Accept
          </Button>
          <Button onClick={() => dispatch('DECLINE')}>Decline</Button>
        </Space>
      );
    case 'accepted':
      return 'accepted';

    case 'declined':
      return 'declined';
  }
}
