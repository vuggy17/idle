import { FriendRepository, FriendRepositoryImpl } from './repository';
import { Module, Provider } from '@nestjs/common';
import { FriendController } from './controller';
import { FriendService } from './service';
import { RealTimeNotificationService } from '../notification';

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
})
export class FriendModule {}
