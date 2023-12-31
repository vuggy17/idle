import { Module, Provider } from '@nestjs/common';
import { FirebaseModule } from '../../infra/firebase';
import { FCMTokenRepositoryImpl } from './FCMToken.repository';
import { NotificationController } from './notification.controller';
import { RealTimeNotificationService } from './notification.service';

const providers: Provider[] = [
  RealTimeNotificationService,
  {
    provide: FCMTokenRepositoryImpl.name,
    useClass: FCMTokenRepositoryImpl,
  },
];

@Module({
  imports: [FirebaseModule],
  controllers: [NotificationController],
  providers: [...providers],
})
export class NotificationModule {}
