import { Body, Controller, Inject, Post } from '@nestjs/common';
import {
  DeactivateAccountRequestDTO,
  DeactivateAccountResponseDTO,
} from '@idle/model';
import {
  PersistentAppWriteProvider,
  AppWriteProvider,
} from '../../infra/appwrite';

const UserStatus = {
  disabled: false,
  active: true,
} as const;

@Controller('auth')
export class AuthController {
  constructor(
    @Inject(PersistentAppWriteProvider)
    private readonly sdk: AppWriteProvider,
  ) {}

  @Post('disable')
  async disableUser(
    @Body() user: DeactivateAccountRequestDTO,
  ): Promise<DeactivateAccountResponseDTO> {
    return this.sdk.users.updateStatus(user.id, UserStatus.disabled);
  }
}
