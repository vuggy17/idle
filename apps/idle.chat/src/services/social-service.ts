import {
  FriendRequestResponseDTO,
  GetFriendRequestStatusResponseDTO,
  GetPendingFriendRequestResponseDTO,
  GetUserSearchResultRequestDTO,
  GetUserSearchResultResponseDTO,
  GetUserSearchSuggestionRequestDTO,
  GetUserSearchSuggestionResponseDTO,
} from '@idle/model';
import { SocialRepository } from '../features/profile-management/repositories/social-repository';
import HttpProvider, { HttpClient } from '../providers/http';

export default class SocialService implements SocialRepository {
  constructor(private httpGateway: HttpClient) {}

  async getUserSearchSuggestions(
    data: GetUserSearchSuggestionRequestDTO,
    abortSignal: AbortSignal,
  ): Promise<GetUserSearchSuggestionResponseDTO> {
    return this.httpGateway.getUserSearchSuggestions({
      q: data.q,
      abortSignal,
    });
  }

  async getUserSearchResult(
    data: GetUserSearchResultRequestDTO,
    abortSignal: AbortSignal,
  ): Promise<GetUserSearchResultResponseDTO> {
    return this.httpGateway.getUserSearchResults({ q: data.q, abortSignal });
  }

  async getPendingFriendRequests(): Promise<GetPendingFriendRequestResponseDTO> {
    return this.httpGateway.getPendingFriendRequests();
  }

  async getFriendRequestStatus(
    friendId: string,
  ): Promise<GetFriendRequestStatusResponseDTO> {
    return this.httpGateway.getFriendRequestStatus(friendId);
  }

  async createFriendRequest(
    receiver: string,
  ): Promise<FriendRequestResponseDTO> {
    return this.httpGateway.sendFriendRequest({
      sentTo: receiver,
    });
  }

  async acceptFriendRequest(
    requestId: string,
  ): Promise<FriendRequestResponseDTO> {
    return this.httpGateway.acceptFriendRequest(requestId);
  }

  async declineFriendRequest(
    requestId: string,
  ): Promise<FriendRequestResponseDTO> {
    return this.httpGateway.declineFriendRequest(requestId);
  }

  async cancelFriendRequest(
    requestId: string,
  ): Promise<FriendRequestResponseDTO> {
    return this.httpGateway.modifyFriendRequest({
      action: 'cancel',
      requestId,
    });
  }
}

export const SocialServiceImpl = new SocialService(HttpProvider);
