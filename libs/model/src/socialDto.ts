import { UserDTO } from './authDto';

export type GetUserSearchSuggestionRequestDTO = {
  q: string;
  abortSignal: AbortSignal;
};
export type GetUserSearchSuggestionResponseDTO = {
  id: string;
  name: string;
  avatar: string;
  bio: string;
  isFriend: boolean;
  hasPendingRequest: boolean;
}[];

export type FindUserByNameResponseDTO = FindUserSingleResponseDTO[];

export type FindUserSingleResponseDTO = {
  id: string;
  name: string;
  avatar?: string;
  bio: string;
  isFriend: boolean;
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
