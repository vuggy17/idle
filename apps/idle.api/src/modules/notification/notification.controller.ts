import { Body, Controller, Get, Inject, Post } from '@nestjs/common';
import { RealTimeNotificationService } from './notification.service';
import { SaveFCMTokenRequestDTO } from '@idle/model';
import { FCMTokenRepository } from '../../config/repository';
import { FCMTokenRepositoryImpl } from './FCMToken.repository';

@Controller('notifications')
export class NotificationController {
  constructor(
    private readonly realtimeNotiService: RealTimeNotificationService,
    @Inject(FCMTokenRepositoryImpl.name)
    private FCMTokenRepo: FCMTokenRepository,
  ) {}

  @Post('fcm')
  async saveFirebaseCloudMessageToken(@Body() body: SaveFCMTokenRequestDTO) {
    const { token } = body;
    console.log(
      '🚀 ~ file: notification.controller.ts:17 ~ NotificationController ~ saveFirebaseCloudMessageToken ~ body:',
      body,
    );
    return this.FCMTokenRepo.save(token, '654b5ff6a20b3ba2f183', Date.now());
  }

  @Get('fcm')
  async get() {
    return this.FCMTokenRepo.get('654b5ff6a20b3ba2f183');
  }
}
