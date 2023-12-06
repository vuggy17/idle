import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import envSchema from '../../config/schema';
import { AuthModule } from '../auth/auth.module';
import { AppWriteModule } from '../../infra/appwrite/appwrite.module';
import { UserModule } from '../user/user.module';
import { FirebaseModule } from '../../infra/firebase/firebase.module';
import { NotificationModule } from '../notification/notification.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [envSchema],
      cache: true,
    }),
    AppWriteModule,
    FirebaseModule,
    AuthModule,
    UserModule,
    NotificationModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
