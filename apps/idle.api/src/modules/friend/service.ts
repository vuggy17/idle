import { BadRequestException, Injectable } from '@nestjs/common';
import { ID } from '@idle/model';
import { FriendRepository } from './repository';
import { FriendRequestStatus, FriendRequestStatusType } from './entities';
import { FriendRequestEntity } from '../common/friendRequest.entity';
import { messages } from '../../assets/errorMessages.json';

@Injectable()
export class FriendService {
  constructor(private readonly _friendRequestRepository: FriendRepository) {}

  async createFriendRequest(
    sender: ID,
    receiver: ID,
  ): Promise<FriendRequestEntity> {
    // Check if sender and receiver are the same user
    if (sender === receiver) {
      throw new BadRequestException(messages.friendRequest.sameUser);
    }
    // Find existing friend request
    const existedRequest =
      await this._friendRequestRepository.findFriendRequest(sender, receiver);

    // If request exists, update it, otherwise create a new one
    const request = existedRequest
      ? await this.updateFriendRequest(
          existedRequest.$id,
          FriendRequestStatus.pending,
        )
      : await this.createNewFriendRequest(sender, receiver);

    return request;
  }

  async getFriendRequest(requestId: ID) {
    return this._friendRequestRepository.getFriendRequest(requestId);
  }

  async acceptFriendRequest(requestId: ID) {
    const request = await this.updateFriendRequest(
      requestId,
      FriendRequestStatus.accepted,
    );

    // make friend
    const jobs = [
      this._friendRequestRepository.addFriend(
        request.receiver.$id,
        request.sender.$id,
      ),
      this._friendRequestRepository.addFriend(
        request.sender.$id,
        request.receiver.$id,
      ),
    ];
    await Promise.all(jobs);

    return request;
  }

  async declineFriendRequest(requestId: ID) {
    const request = await this.updateFriendRequest(
      requestId,
      FriendRequestStatus.declined,
    );

    return request;
  }

  async cancelFriendRequest(requestId: ID) {
    const request = await this.updateFriendRequest(
      requestId,
      FriendRequestStatus.cancelled,
    );

    return request;
  }

  private async updateFriendRequest(
    existedRequest: ID,
    status: FriendRequestStatusType,
  ): Promise<FriendRequestEntity> {
    const doc = await this._friendRequestRepository.updateFriendRequestStatus(
      existedRequest,
      {
        status,
      },
    );
    return doc;
  }

  private async createNewFriendRequest(
    sender: ID,
    receiver: ID,
  ): Promise<FriendRequestEntity> {
    const request = await this._friendRequestRepository.createFriendRequest(
      sender,
      receiver,
    );
    return request;
  }
}
