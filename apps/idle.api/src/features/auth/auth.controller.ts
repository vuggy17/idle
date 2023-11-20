import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppWriteProvider } from 'gateways/appwrite.provider';
import { DisableUserDTO } from 'dto/auth.dto';

const UserStatus = {
  disabled: false,
  active: true,
} as const;

@Controller('auth')
export class AuthController {
  constructor(private readonly sdk: AppWriteProvider) {}

  @Post('disable')
  async disableUser(@Body() user: DisableUserDTO) {
    return this.sdk.users.updateStatus(user.id, UserStatus.disabled);
  }
}
