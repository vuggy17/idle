import { Body, Controller, Get, Inject, Post } from '@nestjs/common';
import {
  DeactivateAccountRequestDTO,
  DeactivateAccountResponseDTO,
} from '@idle/model';
import {
  PersistentAppWriteProvider,
  AppWriteProvider,
} from '../../infra/appwrite';
import { Auth } from '../../config/decorators/auth';
import { UserEntity } from '../common/user.entity';
import { AuthUser } from '../../config/decorators/authUser';
import { UserRepository } from '../user/repository';

const UserStatus = {
  disabled: false,
  active: true,
} as const;

@Auth()
@Controller('auth')
export class AuthController {
  constructor(
    @Inject(PersistentAppWriteProvider)
    private readonly sdk: AppWriteProvider,
    private readonly _userRepository: UserRepository,
  ) {}

  @Post('disable')
  async disableUser(
    @Body() user: DeactivateAccountRequestDTO,
  ): Promise<DeactivateAccountResponseDTO> {
    return this.sdk.users.updateStatus(user.id, UserStatus.disabled);
  }

  @Get('me')
  async getMe(@AuthUser() user: UserEntity) {
    return this._userRepository.getById(user.id);
  }
}
