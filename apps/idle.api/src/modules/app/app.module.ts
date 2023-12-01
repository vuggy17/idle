import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import envSchema from '../../config/schema';
import { AuthModule } from '../auth/auth.module';
import { AppWriteModule } from '../appwrite/appwrite.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [envSchema],
    }),
    AppWriteModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
