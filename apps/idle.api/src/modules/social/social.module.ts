import { Module } from '@nestjs/common';
import { FriendController } from './friend.controller';
import { FriendService } from './friend.service';
import { RealTimeNotificationService } from '../notification';

const providers = [RealTimeNotificationService, FriendService];
/**
 * Friend adding, user blocking,..
 */
@Module({
  imports: [],
  controllers: [FriendController],
  providers: [...providers],
})
export class SocialModule {}
