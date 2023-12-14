import { Body, Controller, Get, Inject, Post } from '@nestjs/common';
import { SaveFCMTokenRequestDTO } from '@idle/model';
import { FCMTokenRepository } from '../../config/repository';
import { FCMTokenRepositoryImpl } from './FCMToken.repository';
import { AuthUser } from '../../config/decorators/authUser';
import { UserEntity } from '../common/user.entity';
import { Auth } from '../../config/decorators/auth';

@Auth()
@Controller('notifications')
export class NotificationController {
  constructor(
    @Inject(FCMTokenRepositoryImpl.name)
    private FCMTokenRepo: FCMTokenRepository,
  ) {}

  @Post('fcm')
  async saveFirebaseCloudMessageToken(@Body() body: SaveFCMTokenRequestDTO) {
    const { token } = body;

    return this.FCMTokenRepo.save(token, '654b5ff6a20b3ba2f183', Date.now());
  }

  @Get('fcm')
  async get(@AuthUser() user: UserEntity) {
    console.log('auth user', user);
    return this.FCMTokenRepo.get(user.id);
  }
}
