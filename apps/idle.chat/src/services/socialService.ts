import {
  AcceptFriendRequestResponseDTO,
  DeclineFriendRequestResponseDTO,
  FindUserByNameResponseDTO,
  GetFriendRequestStatusResponseDTO,
  GetPendingFriendRequestResponseDTO,
  GetUserSearchSuggestionRequestDTO,
  GetUserSearchSuggestionResponseDTO,
} from '@idle/model';
import { SocialRepository } from '@idle/chat/features/profileManagement/repositories/socialRepository';
import HttpProvider, { HttpClient } from '@idle/chat/providers/http';

export default class SocialService implements SocialRepository {
  constructor(private httpGateway: HttpClient) {}

  async getUserSearchSuggestions(
    data: GetUserSearchSuggestionRequestDTO,
  ): Promise<GetUserSearchSuggestionResponseDTO> {
    return this.httpGateway.getUserSearchSuggestions(data.q, data.abortSignal);
  }

  async getPendingFriendRequests(): Promise<GetPendingFriendRequestResponseDTO> {
    return this.httpGateway.getPendingFriendRequests();
  }

  async getFriendRequestStatus(
    friendId: string,
  ): Promise<GetFriendRequestStatusResponseDTO> {
    return this.httpGateway.getFriendRequestStatus(friendId);
  }

  async acceptFriendRequest(
    requestId: string,
  ): Promise<AcceptFriendRequestResponseDTO> {
    return this.httpGateway.acceptFriendRequest(requestId);
  }

  async declineFriendRequest(
    requestId: string,
  ): Promise<DeclineFriendRequestResponseDTO> {
    return this.httpGateway.declineFriendRequest(requestId);
  }
}

export const SocialServiceImpl = new SocialService(HttpProvider);
