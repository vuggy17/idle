import { UseCase } from 'type';
import { UserRepository } from '../repositories/userRepository';
import { LoginUserRequestDTO, LoginUserResponseDTO } from 'dto/authDto';

export class LoginUseCase
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
