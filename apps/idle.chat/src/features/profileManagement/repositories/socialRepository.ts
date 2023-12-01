import {
  GetFriendRequestStatusResponseDTO,
  GetPendingFriendRequestResponseDTO,
  DeclineFriendRequestResponseDTO,
  AcceptFriendRequestResponseDTO,
  GetUserSearchSuggestionRequestDTO,
  GetUserSearchSuggestionResponseDTO,
} from '@idle/model';

export interface SocialRepository {
  getUserSearchSuggestions(
    data: GetUserSearchSuggestionRequestDTO,
  ): Promise<GetUserSearchSuggestionResponseDTO>;

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
