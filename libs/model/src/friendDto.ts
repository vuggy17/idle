import { UserDTO } from './authDto';
import { ID, TIME } from './common';

export type GetPendingFriendRequestResponseDTO = {
  id: ID;
  name: string;
  avatar: string;
  createdAt: TIME;
};

// A request is valid when it is not accepted or deleted
export type GetFriendRequestStatusResponseDTO = { isValid: boolean };
export type AcceptFriendRequestResponseDTO = UserDTO;
export type DeclineFriendRequestResponseDTO =
  GetPendingFriendRequestResponseDTO;

export type CreateFriendRequestRequestDTO = {
  /* `sentTo` is a property in the `CreateFriendRequestRequestDTO` interface. It represents the ID of
  the user to whom the friend request is being sent. */
  sentTo: ID;
};

/**
 * Status of a friend request
 * - `pending`: The friend request has been sent, but the recipient has not yet responded.
 * - `accepted`: The recipient has accepted the friend request.
 * - `declined`: The recipient has declined the friend request.
 * - `cancelled`: The sender has cancelled the friend request before the recipient could respond.
 */
type FriendRequestStatus = 'pending' | 'accepted' | 'declined' | 'cancelled';
export type CreateFriendRequestResponseDTO = {
  id: ID;
  status: FriendRequestStatus;
  sender: UserDTO;
  receiver: UserDTO;
  createdAt: TIME;
  updatedAt: TIME;
};
