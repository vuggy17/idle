import { Injectable } from '@nestjs/common';
import { ID } from '@idle/model';
import { RealTimeNotificationService } from '../notification';
import { FriendRepository } from './repository';

@Injectable()
export class FriendService {
  constructor(
    private readonly _notificationService: RealTimeNotificationService,
    private readonly _friendRepository: FriendRepository,
  ) {}

  async createFriendRequest(sender: ID, receiver: ID) {
    const request = await this._friendRepository.createFriendRequest(
      sender,
      receiver,
    );
    console.log(
      '🚀 ~ file: service.ts:18 ~ FriendService ~ createFriendRequest ~ request:',
      request,
    );
    await this._notificationService.sendFriendRequestNotification(
      sender,
      receiver,
    );
    // cache noti incase sent failed
  }
}
