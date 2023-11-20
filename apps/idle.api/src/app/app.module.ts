import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import envSchema from '../config/schema';
import { AuthModule } from 'features/auth/auth.module';
import { AppWriteModule } from 'gateways/appwite.module';

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
