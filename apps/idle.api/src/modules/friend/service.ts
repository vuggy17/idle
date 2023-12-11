import { BadRequestException, Injectable } from '@nestjs/common';
import { ID } from '@idle/model';
import { FriendRepository } from './repository';
import { FriendRequestStatus } from './entities';
import { FriendRequestEntity } from '../common/friend.entity';
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
    const existedRequest = await this._friendRequestRepository.getFriendRequest(
      sender,
      receiver,
    );

    // If request exists, update it, otherwise create a new one
    const request = existedRequest
      ? await this.updateFriendRequest(existedRequest.$id)
      : await this.createNewFriendRequest(sender, receiver);

    return request;
  }

  // Extracted method to update an existing friend request
  async updateFriendRequest(existedRequest: ID): Promise<FriendRequestEntity> {
    const doc = await this._friendRequestRepository.updateFriendRequestStatus(
      existedRequest,
      {
        status: FriendRequestStatus.pending,
      },
    );
    return doc;
  }

  // Extracted method to create a new friend request
  async createNewFriendRequest(
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
