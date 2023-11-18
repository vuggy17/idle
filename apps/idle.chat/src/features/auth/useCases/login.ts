import { UseCase } from 'type';
import { LoginUserRequestDTO, LoginUserResponseDTO } from 'dto/authDto';
import { UserRepository } from '../repositories/userRepository';

export default class LoginUseCase
  implements UseCase<LoginUserRequestDTO, LoginUserResponseDTO>
{
  constructor(private userRepository: UserRepository) {}

  async execute({
    email,
    password,
  }: LoginUserRequestDTO): Promise<LoginUserResponseDTO> {
    return this.userRepository.login(email, password);
  }
}
