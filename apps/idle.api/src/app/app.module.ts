import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppWriteProvider } from './appwrite.provider';
import { ConfigModule } from '@nestjs/config';
import envSchema from '../config/schema';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [envSchema],
    }),
  ],
  controllers: [AppController],
  providers: [AppService, AppWriteProvider],
})
export class AppModule {}
