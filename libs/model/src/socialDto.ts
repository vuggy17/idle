import { UserDTO } from './authDto';

export type GetUserSearchSuggestionRequestDTO = {
  q: string;
};
export type GetUserSearchSuggestionResponseDTO = {
  id: string;
  name: string;
  avatar: string;
}[];

export type GetUserSearchResultRequestDTO = {
  q: string;
};
export type GetUserSearchResultResponseDTO = {
  id: string;
  name: string;
  avatar: string;
  bio: string;
  isFriend: boolean;
  hasPendingRequest: boolean;
}[];

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
