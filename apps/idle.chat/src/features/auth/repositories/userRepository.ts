import { RegisterUserRequestDTO, RegisterUserResponseDTO } from 'dto/authDto';

export interface UserRepository {
  register(userData: RegisterUserRequestDTO): Promise<RegisterUserResponseDTO>;
}
