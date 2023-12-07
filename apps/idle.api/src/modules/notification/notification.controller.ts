import { Body, Controller, Get, Inject, Post, UseGuards } from '@nestjs/common';
import { SaveFCMTokenRequestDTO } from '@idle/model';
import { FCMTokenRepository } from '../../config/repository';
import { FCMTokenRepositoryImpl } from './FCMToken.repository';
import { AuthGuard } from '../../config/guards/auth.guard';
import { AuthUser } from '../../config/decorators/authUser.decorator';
import { UserEntity } from '../user';

@Controller('notifications')
export class NotificationController {
  constructor(
    @Inject(FCMTokenRepositoryImpl.name)
    private FCMTokenRepo: FCMTokenRepository,
  ) {}

  @UseGuards(AuthGuard)
  @Post('fcm')
  async saveFirebaseCloudMessageToken(@Body() body: SaveFCMTokenRequestDTO) {
    const { token } = body;

    return this.FCMTokenRepo.save(token, '654b5ff6a20b3ba2f183', Date.now());
  }

  @UseGuards(AuthGuard)
  @Get('fcm')
  async get(@AuthUser() user: UserEntity) {
    console.log('auth user', user);
    return this.FCMTokenRepo.get(user.$id);
  }
}
