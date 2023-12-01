import { UserDTO } from '../../../../libs/model/src/authDto';

export type FindUserByNameRequestDTO = {
  q: string;
  abortSignal: AbortSignal;
};
export type FindUserByNameResponseDTO = FindUserSingleResponseDTO[];

export type FindUserSingleResponseDTO = {
  id: string;
  name: string;
  bio: string;
  isFriend: boolean;
  avatar?: string;
  hasPendingRequest?: boolean;
};

export type GetPendingFriendRequestResponseDTO = {
  id: string;
  name: string;
  avatar: string;
  createdAt: number;
};

// A request is valid when it is not accepted or deleted
export type GetFriendRequestStatusResponseDTO = { isValid: boolean };
export type AcceptFriendRequestResponseDTO = UserDTO;
export type DeclineFriendRequestResponseDTO =
  GetPendingFriendRequestResponseDTO;
