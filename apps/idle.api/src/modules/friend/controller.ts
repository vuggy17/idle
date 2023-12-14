import {
  CreateFriendRequestRequestDTO,
  ID,
  ModifyFriendRequestDTO,
} from '@idle/model';
import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Query,
} from '@nestjs/common';
import { FriendService } from './service';
import { Auth } from '../../config/decorators/auth';
import { AuthUser } from '../../config/decorators/authUser';
import { AppWriteUserEntity } from '../common/user.entity';

@Auth()
@Controller('friends')
export class FriendController {
  constructor(private readonly friendService: FriendService) {}

  /**
   *
   * @param user
   * @param body
   * @returns {Promise<FriendRequestResponseDTO>} response
   */
  @Post('invitation/create')
  async handleSendingFriendRequest(
    @AuthUser() user: AppWriteUserEntity,
    @Body() body: CreateFriendRequestRequestDTO,
  ) {
    const receiver = body.sentTo;
    const sender = user.$id;
    const request = await this.friendService.createFriendRequest(
      sender,
      receiver,
    );
    return request;
  }

  @Get('invitation')
  async getFriendRequest(@Query('id') requestId: ID) {
    return this.friendService.getFriendRequest(requestId);
  }

  @Post('invitation')
  async handleUpdateFriendRequest(@Body() body: ModifyFriendRequestDTO) {
    const { action, requestId } = body;
    switch (action) {
      case 'accept':
        return this.friendService.acceptFriendRequest(requestId);
      case 'decline':
        return this.friendService.declineFriendRequest(requestId);
      case 'cancel':
        return this.friendService.cancelFriendRequest(requestId);
      default:
        throw new BadRequestException('Unknown action: ', action);
    }
  }

  @Get('invitations')
  async getAllFriendInvitation(@AuthUser() user: AppWriteUserEntity) {
    return this.friendService.getAllFriendRequest(user.$id, 'pending');
  }
}
