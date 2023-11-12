import { Account, ID } from 'appwrite';
import {
  LoginUserResponseDTO,
  RegisterUserRequestDTO,
  RegisterUserResponseDTO,
  UserDTO,
} from 'dto/authDto';
import { UserRepository } from 'features/auth/repositories/userRepository';

export class AuthService implements UserRepository {
  constructor(private accountGateway: Account) {}

  async login(email: string, password: string): Promise<LoginUserResponseDTO> {
    const response = await this.accountGateway.createEmailSession(
      email,
      password
    );
    return response;
  }

  async register(
    userData: RegisterUserRequestDTO
  ): Promise<RegisterUserResponseDTO> {
    const response = await this.accountGateway.create(
      ID.unique(),
      userData.email,
      userData.password,
      userData.name
    );
    return response;
  }

  /**
   *
   * @return current logged in user
   */
  async getCurrentUser(): Promise<UserDTO> {
    return this.accountGateway.get();
  }

  /**
   * logout user by delete the `current` session
   */
  async logout(sessionId = 'current'): Promise<void> {
    await this.accountGateway.deleteSession(sessionId);
  }
}
