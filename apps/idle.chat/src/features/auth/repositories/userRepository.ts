import {
  LoginUserResponseDTO,
  RegisterUserRequestDTO,
  RegisterUserResponseDTO,
} from 'dto/authDto';

export interface UserRepository {
  register(userData: RegisterUserRequestDTO): Promise<RegisterUserResponseDTO>;
  login(email: string, password: string): Promise<LoginUserResponseDTO>;
}
