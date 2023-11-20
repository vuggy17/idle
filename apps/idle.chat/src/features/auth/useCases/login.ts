import { UseCase } from 'type';
import { LoginUserRequestDTO, LoginUserResponseDTO } from 'dto/authDto';
import { AuthServiceImpl } from 'services/authService';
import { UserRepository } from '../repositories/userRepository';

export default class LoginUseCase
  implements UseCase<LoginUserRequestDTO, LoginUserResponseDTO>
{
  constructor(private userRepository: UserRepository = AuthServiceImpl) {}

  async execute({
    email,
    password,
  }: LoginUserRequestDTO): Promise<LoginUserResponseDTO> {
    return this.userRepository.login(email, password);
  }
}
