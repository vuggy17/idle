import { UserDTO } from './authDto';
import { ID, TIME } from './common';

export type GetPendingFriendRequestResponseDTO = FriendRequestResponseDTO[];

export type GetFriendRequestStatusResponseDTO = FriendRequestResponseDTO;
export type CreateFriendRequestRequestDTO = {
  sentTo: ID;
};

export type ModifyFriendRequestDTO = {
  requestId: ID;
  action: 'accept' | 'decline' | 'cancel';
};

/**
 * Status of a friend request
 * - `pending`: The friend request has been sent, but the recipient has not yet responded.
 * - `accepted`: The recipient has accepted the friend request.
 * - `declined`: The recipient has declined the friend request.
 * - `cancelled`: The sender has cancelled the friend request before the recipient could respond.
 */
type FriendRequestStatus = 'pending' | 'accepted' | 'declined' | 'cancelled';
export type FriendRequestResponseDTO = {
  id: ID;
  status: FriendRequestStatus;
  sender: UserDTO;
  receiver: UserDTO;
  createdAt: TIME;
  updatedAt: TIME;
};

export type FindFriendRequestDTO = {
  q: string;
};

export type FindFriendResponseDTO = UserDTO[];
