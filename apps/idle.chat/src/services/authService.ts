import { Account, ID } from 'appwrite';
import {
  LoginUserResponseDTO,
  RegisterUserRequestDTO,
  RegisterUserResponseDTO,
  UserDTO,
} from '@idle/model';
import { UserRepository } from '@idle/chat/features/auth/repositories/userRepository';
import { AppWriteProvider } from '@idle/chat/providers/appwrite';
import HttpProvider, { HttpClient } from '@idle/chat/providers/http';

export default class AuthService implements UserRepository {
  constructor(
    private accountGateway: Account,
    private httpGateway: HttpClient,
  ) {}

  async login(email: string, password: string): Promise<LoginUserResponseDTO> {
    const response = await this.accountGateway.createEmailSession(
      email,
      password,
    );
    return response;
  }

  async register(
    userData: RegisterUserRequestDTO,
  ): Promise<RegisterUserResponseDTO> {
    const response = await this.accountGateway.create(
      ID.unique(),
      userData.email,
      userData.password,
      userData.name,
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

  async changePassword(currentPass: string, newPass: string): Promise<UserDTO> {
    return this.accountGateway.updatePassword(newPass, currentPass);
  }

  async disableAccount(accId: string): Promise<UserDTO> {
    const result = await this.httpGateway.disableAccount<UserDTO>({
      id: accId,
    });
    return result.data;
  }
}

export const AuthServiceImpl = new AuthService(
  new Account(AppWriteProvider),
  HttpProvider,
);
