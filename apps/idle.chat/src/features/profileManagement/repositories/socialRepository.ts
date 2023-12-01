import {
  FindUserByNameResponseDTO,
  GetFriendRequestStatusResponseDTO,
  GetPendingFriendRequestResponseDTO,
  FindUserByNameRequestDTO,
  DeclineFriendRequestResponseDTO,
  AcceptFriendRequestResponseDTO,
} from '@idle/chat/dto/socialDto';

export interface SocialRepository {
  findUserByName(
    data: FindUserByNameRequestDTO,
  ): Promise<FindUserByNameResponseDTO>;

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
