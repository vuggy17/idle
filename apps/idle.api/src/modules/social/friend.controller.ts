import {
  CreateFriendRequestRequestDTO,
  CreateFriendRequestResponseDTO,
} from '@idle/model';
import { Body, Controller, Post } from '@nestjs/common';
import { RealTimeNotificationService } from '../notification';
import { FriendService } from './friend.service';

@Controller('friend-request')
export class FriendController {
  constructor(
    private readonly rtNoti: RealTimeNotificationService,
    private readonly friendService: FriendService,
  ) {}

  @Post()
  async handleSendingFriendRequest(
    @Body() body: CreateFriendRequestRequestDTO,
  ): Promise<CreateFriendRequestResponseDTO> {
    const receiver = body.sentTo;
    const user: { id: string } = { id: 'userid' };
    const request = await this.friendService.createFriendRequest(
      user.id,
      receiver,
    );

    const noti = await this.rtNoti.sendFriendRequestNotification(
      user.id,
      receiver,
    );
    // cache noti incase sent failed

    return request as unknown as CreateFriendRequestResponseDTO;
  }
}
