import { FirebaseModule } from '../firebase/firebase.module';
import { FCMTokenRepositoryImpl } from './FCMToken.repository';
import { NotificationController } from './notification.controller';
import { RealTimeNotificationService } from './notification.service';
import { NotificationService } from './type';
import { Module, Provider } from '@nestjs/common';

const providers: Provider[] = [
  RealTimeNotificationService,
  {
    provide: FCMTokenRepositoryImpl.name,
    useClass: FCMTokenRepositoryImpl,
  },
  FCMTokenRepositoryImpl,
];

@Module({
  imports: [FirebaseModule],
  controllers: [NotificationController],
  providers: [...providers],
})
export class NotificationModule {}
