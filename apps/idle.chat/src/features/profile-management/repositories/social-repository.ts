import {
  GetFriendRequestStatusResponseDTO,
  GetPendingFriendRequestResponseDTO,
  GetUserSearchSuggestionRequestDTO,
  GetUserSearchSuggestionResponseDTO,
  GetUserSearchResultRequestDTO,
  GetUserSearchResultResponseDTO,
  ID,
  FriendRequestResponseDTO,
} from '@idle/model';

export interface SocialRepository {
  getUserSearchSuggestions(
    data: GetUserSearchSuggestionRequestDTO,
    abortSignal: AbortSignal,
  ): Promise<GetUserSearchSuggestionResponseDTO>;

  getUserSearchResult(
    data: GetUserSearchResultRequestDTO,
    abortSignal: AbortSignal,
  ): Promise<GetUserSearchResultResponseDTO>;

  getPendingFriendRequests(): Promise<GetPendingFriendRequestResponseDTO>;

  getFriendRequestStatus(
    requestId: string,
  ): Promise<GetFriendRequestStatusResponseDTO>;

  acceptFriendRequest(requestId: string): Promise<FriendRequestResponseDTO>;

  declineFriendRequest(requestId: string): Promise<FriendRequestResponseDTO>;

  cancelFriendRequest(requestId: string): Promise<FriendRequestResponseDTO>;

  createFriendRequest(receiver: ID): Promise<FriendRequestResponseDTO>;
}
