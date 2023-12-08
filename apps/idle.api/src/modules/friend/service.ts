import { BadRequestException, Injectable } from '@nestjs/common';
import { ID } from '@idle/model';
import { RealTimeNotificationService } from '../notification';
import { FriendRequestRepository } from './repository';
import { FriendRequestEntity, FriendRequestStatus } from './entities';
import { messages } from '../../assets/errorMessages.json';
@Injectable()
export class FriendService {
  constructor(
    private readonly _notificationService: RealTimeNotificationService,
    private readonly _friendRequestRepository: FriendRequestRepository,
  ) {}

  async createFriendRequest(
    sender: ID,
    receiver: ID,
  ): Promise<FriendRequestEntity> {
    // Check if sender and receiver are the same user
    if (sender === receiver) {
      throw new BadRequestException(messages.friendRequest.sameUser);
    }

    // Find existing friend request
    const existedRequest = await this._friendRequestRepository.findExisted(
      sender,
      receiver,
    );

    // If request exists, update it, otherwise create a new one
    const request = existedRequest
      ? await this.updateFriendRequest(existedRequest)
      : await this.createNewFriendRequest(sender, receiver);

    return request;
  }

  // Extracted method to update an existing friend request
  async updateFriendRequest(existedRequest: ID): Promise<FriendRequestEntity> {
    const doc = await this._friendRequestRepository.update(existedRequest, {
      status: FriendRequestStatus.pending,
    });
    return doc;
  }

  // Extracted method to create a new friend request
  async createNewFriendRequest(
    sender: ID,
    receiver: ID,
  ): Promise<FriendRequestEntity> {
    const request = await this._friendRequestRepository.create(
      sender,
      receiver,
    );
    return request;
  }
}
