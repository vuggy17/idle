import { Module } from '@nestjs/common';

import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import envSchema from '../../config/schema';
import { AuthModule } from '../auth/auth.module';
import { AppWriteModule } from '../../infra/appwrite';
import { UserModule } from '../user/user.module';
import { FriendModule } from '../friend/module';
import { RoomModule } from '../room/room.module';
import { PrismaModule } from '../../infra/prisma';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [envSchema],
      cache: true,
    }),
    // infra
    AppWriteModule,
    PrismaModule,
    // FirebaseModule,

    // functional
    AuthModule,
    UserModule,
    // NotificationModule,
    FriendModule,
    RoomModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
// eslint-disable-next-line import/prefer-default-export
export class AppModule {}
