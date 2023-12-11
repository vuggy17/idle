import { Module, Provider } from '@nestjs/common';
import { FriendRepository, FriendRepositoryImpl } from './repository';
import { FriendController } from './controller';
import { FriendService } from './service';
import { RealTimeNotificationService } from '../notification/notification.service';

const providers: Provider[] = [
  RealTimeNotificationService,
  FriendService,
  {
    provide: FriendRepository,
    useClass: FriendRepositoryImpl,
  },
];
/**
 * Friend adding, user blocking,..
 */
@Module({
  imports: [],
  controllers: [FriendController],
  providers: [...providers],
  exports: [
    {
      provide: FriendRepository,
      useClass: FriendRepositoryImpl,
    },
  ],
})
export class FriendModule {}
