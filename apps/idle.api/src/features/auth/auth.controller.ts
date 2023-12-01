import { Body, Controller, Post } from '@nestjs/common';
import { AppWriteProvider } from '../../gateways/appwrite.provider';
import {
  DeactivateAccountRequestDTO,
  DeactivateAccountResponseDTO,
} from '@idle/model';

const UserStatus = {
  disabled: false,
  active: true,
} as const;

@Controller('auth')
export class AuthController {
  constructor(private readonly sdk: AppWriteProvider) {}

  @Post('disable')
  async disableUser(
    @Body() user: DeactivateAccountRequestDTO,
  ): Promise<DeactivateAccountResponseDTO> {
    return this.sdk.users.updateStatus(user.id, UserStatus.disabled);
  }
}
