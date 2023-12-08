import {
  CreateFriendRequestRequestDTO,
  CreateFriendRequestResponseDTO,
} from '@idle/model';
import { Body, Controller, Post } from '@nestjs/common';
import { FriendService } from './service';
import { Auth } from '../../config/decorators/auth';
import { AuthUser } from '../../config/decorators/authUser';
import { UserEntity } from '../user';
import { FriendRequestEntity } from './entities';

@Auth()
@Controller('friends')
export class FriendController {
  constructor(private readonly friendService: FriendService) {}

  /**
   *
   * @param user
   * @param body
   * @returns {Promise<CreateFriendRequestResponseDTO>} response
   */
  @Post('invitation')
  async handleSendingFriendRequest(
    @AuthUser() user: UserEntity,
    @Body() body: CreateFriendRequestRequestDTO,
  ) {
    const receiver = body.sentTo;
    const sender = user.$id;
    const request = await this.friendService.createFriendRequest(
      sender,
      receiver,
    );
    return new FriendRequestEntity(request);
  }
}
