import {
  DeactivateAccountResponseDTO,
  LoginUserResponseDTO,
  RegisterUserRequestDTO,
  RegisterUserResponseDTO,
  UserDTO,
} from '@idle/chat/dto/authDto';

export interface UserRepository {
  register(userData: RegisterUserRequestDTO): Promise<RegisterUserResponseDTO>;
  login(email: string, password: string): Promise<LoginUserResponseDTO>;
  getCurrentUser(): Promise<UserDTO>;
  logout(sessionId: string): Promise<void>;
  changePassword(currentPass: string, newPass: string): Promise<UserDTO>;
  disableAccount(accId: string): Promise<DeactivateAccountResponseDTO>;
}
