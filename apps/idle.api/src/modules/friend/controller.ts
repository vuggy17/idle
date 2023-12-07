import {
  CreateFriendRequestRequestDTO,
  CreateFriendRequestResponseDTO,
} from '@idle/model';
import { Body, Controller, Post } from '@nestjs/common';
import { FriendService } from './service';
import { Auth } from '../../config/decorators/auth';
import { AuthUser } from '../../config/decorators/authUser';
import { UserEntity } from '../user';

@Auth()
@Controller('friends')
export class FriendController {
  constructor(private readonly friendService: FriendService) {}

  @Post('invitation')
  async handleSendingFriendRequest(
    @AuthUser() user: UserEntity,
    @Body() body: CreateFriendRequestRequestDTO,
  ): Promise<CreateFriendRequestResponseDTO> {
    console.log('first');
    const receiver = body.sentTo;
    const sender = user.$id;
    const request = await this.friendService.createFriendRequest(
      sender,
      receiver,
    );
    return request as unknown as CreateFriendRequestResponseDTO;
  }
}
