import { Account, ID } from 'appwrite';
import {
  LoginUserResponseDTO,
  RegisterUserRequestDTO,
  RegisterUserResponseDTO,
  User,
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

  async getCurrentLoggedInUser(): Promise<User> {
    return this.accountGateway.get();
  }
}
