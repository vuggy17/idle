import { Account } from 'appwrite';
import { RegisterUserRequestDTO, RegisterUserResponseDTO } from 'dto/authDto';
import { UserRepository } from 'features/auth/repositories/userRepository';
import { uniqueId } from 'utils/uniqueId';

export class AuthService implements UserRepository {
  constructor(private accountGateway: Account) {}

  async register(
    userData: RegisterUserRequestDTO
  ): Promise<RegisterUserResponseDTO> {
    const response = await this.accountGateway.create(
      uniqueId(),
      userData.email,
      userData.password
    );
    console.log(
      '🚀 ~ file: authService.ts:17 ~ AuthService ~ response:',
      response
    );

    return userData;
  }
}
