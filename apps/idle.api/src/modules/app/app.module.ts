import { Module } from '@nestjs/common';

import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import envSchema from '../../config/schema';
import { AuthModule } from '../auth/auth.module';
import { AppWriteModule } from '../../infra/appwrite';
import { UserModule } from '../user/user.module';
import { FirebaseModule } from '../../infra/firebase/firebase.module';
import { NotificationModule } from '../notification/notification.module';
import { FriendModule } from '../friend/module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [envSchema],
      cache: true,
    }),
    // infra
    AppWriteModule,
    // FirebaseModule,

    // functional
    AuthModule,
    UserModule,
    // NotificationModule,
    FriendModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
// eslint-disable-next-line import/prefer-default-export
export class AppModule {}
