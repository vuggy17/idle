import {
  ChangePasswordResponseDTO,
  DeactivateAccountResponseDTO,
  LoginUserResponseDTO,
  RegisterUserRequestDTO,
  RegisterUserResponseDTO,
  UserDTO,
} from '@idle/model';

import { Account, ID, Models } from 'appwrite';
import { AppWriteProvider } from '../../../providers/appwrite';
import HttpProvider, { HttpClient } from '../../../providers/http';

export interface AuthRepository {
  register(userData: RegisterUserRequestDTO): Promise<RegisterUserResponseDTO>;
  login(email: string, password: string): Promise<LoginUserResponseDTO>;
  getCurrentUser(): Promise<UserDTO>;
  logout(sessionId: string): Promise<void>;
  changePassword(
    currentPass: string,
    newPass: string,
  ): Promise<ChangePasswordResponseDTO>;
  disableAccount(accId: string): Promise<DeactivateAccountResponseDTO>;
  createAuthToken(): Promise<string>;
}

export default class AuthRepositoryImpl1 implements AuthRepository {
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
    const user = await this.httpGateway.getMe();

    return user;
  }

  /**
   * logout user by delete the `current` session
   */
  async logout(sessionId = 'current'): Promise<void> {
    await this.accountGateway.deleteSession(sessionId);
  }

  async changePassword(
    currentPass: string,
    newPass: string,
  ): Promise<Models.User<Models.Preferences>> {
    return this.accountGateway.updatePassword(newPass, currentPass);
  }

  async disableAccount(accId: string): Promise<DeactivateAccountResponseDTO> {
    const result = await this.httpGateway.disableAccount({
      id: accId,
    });
    return result.data;
  }

  async createAuthToken(): Promise<string> {
    const token = await this.accountGateway.createJWT();
    return token.jwt;
  }
}

export const AuthServiceImpl = new AuthRepositoryImpl1(
  new Account(AppWriteProvider),
  HttpProvider,
);
