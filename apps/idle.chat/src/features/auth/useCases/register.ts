import { UseCase } from 'type';
import { UserRepository } from '../repositories/userRepository';
import { RegisterUserRequestDTO, RegisterUserResponseDTO } from 'dto/authDto';

export class RegisterUseCase
  implements UseCase<RegisterUserRequestDTO, RegisterUserResponseDTO>
{
  constructor(private userRepository: UserRepository) {}

  async execute(
    registerInfo: RegisterUserRequestDTO
  ): Promise<RegisterUserResponseDTO> {
    return await this.userRepository.register(registerInfo);
  }
}
