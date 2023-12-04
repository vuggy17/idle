import { Module } from '@nestjs/common';
import { FriendController } from './friend.controller';
import { RealTimeNotificationService } from '../notification/notification.service';
import { FriendService } from './friend.service';

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
