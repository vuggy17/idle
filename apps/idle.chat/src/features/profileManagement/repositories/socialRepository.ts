import {
  GetFriendRequestStatusResponseDTO,
  GetPendingFriendRequestResponseDTO,
  DeclineFriendRequestResponseDTO,
  AcceptFriendRequestResponseDTO,
  GetUserSearchSuggestionRequestDTO,
  GetUserSearchSuggestionResponseDTO,
  GetUserSearchResultRequestDTO,
  GetUserSearchResultResponseDTO,
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

  acceptFriendRequest(
    requestId: string,
  ): Promise<AcceptFriendRequestResponseDTO>;

  declineFriendRequest(
    requestId: string,
  ): Promise<DeclineFriendRequestResponseDTO>;
}
