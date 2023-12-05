import { Body, Controller, Get, Inject, Post } from '@nestjs/common';
import { RealTimeNotificationService } from './notification.service';
import { SaveFCMTokenRequestDTO } from '@idle/model';
import { FCMTokenRepository } from '../../config/repository';
import { FCMTokenRepositoryImpl } from './FCMToken.repository';

@Controller('notifications')
export class NotificationController {
  constructor(
    private readonly realtimeNotiService: RealTimeNotificationService,
    // @Inject(FCMTokenRepositoryImpl.name)
    private FCMTokenRepo: FCMTokenRepositoryImpl,
  ) {}

  @Post('fcm')
  async saveFirebaseCloudMessageToken(@Body() body: SaveFCMTokenRequestDTO) {
    const { token } = body;

    console.log('token');
  }

  @Get('fcm')
  async get() {
    return this.FCMTokenRepo.get('fdsf');
  }
}
