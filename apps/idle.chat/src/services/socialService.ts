import axios from 'axios';
import {
  AcceptFriendRequestResponseDTO,
  DeclineFriendRequestResponseDTO,
  FindUserByNameRequestDTO,
  FindUserByNameResponseDTO,
  GetFriendRequestStatusResponseDTO,
  GetPendingFriendRequestResponseDTO,
} from 'dto/socialDto';
import { SocialRepository } from 'features/profileManagement/repositories/socialRepository';
import { HttpClient } from 'providers/http';

export default class SocialService implements SocialRepository {
  constructor(private httpGateway: HttpClient) {}

  async findUserByName(
    data: FindUserByNameRequestDTO,
  ): Promise<FindUserByNameResponseDTO> {
    const apiQuery = `${new URLSearchParams({ q: data.q }).toString()}&sfw`;
    const result = await this.httpGateway.findUserByName<{ data: any[] }>(
      apiQuery,
      data.abortSignal,
    );

    // map api data to data
    return result.data.data.map((user) => ({
      id: 'dds',
      name: user.title,
      avatar: user.images.jpg.small_image_url,
      bio: user.background,
      isFriend: user.title.length % 2 === 0,
      hasPendingRequest:
        user.title.length % 2 === 0
          ? false
          : user.images.jpg.small_image_url.length % 2 === 0,
    }));
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

export const SocialServiceImpl = new SocialService(
  new HttpClient(axios.create()),
);
