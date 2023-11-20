import { Account, ID } from 'appwrite';
import {
  LoginUserResponseDTO,
  RegisterUserRequestDTO,
  RegisterUserResponseDTO,
  UserDTO,
} from 'dto/authDto';
import { UserRepository } from 'features/auth/repositories/userRepository';
import { AppWriteProvider } from 'providers/appwrite';
import HttpProvider, { HttpClient } from 'providers/http';

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

  async disableAccount(accId: string): Promise<unknown> {
    const result = await this.httpGateway.disableAccount({
      id: accId,
    });
    console.log(
      '🚀 ~ file: authService.ts:60 ~ AuthService ~ disableAccount ~ result:',
      result,
    );
    return result;
  }
}

export const AuthServiceImpl = new AuthService(
  new Account(AppWriteProvider),
  HttpProvider,
);
