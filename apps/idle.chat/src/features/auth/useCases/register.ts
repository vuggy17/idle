import { UseCase } from 'type';
import { RegisterUserRequestDTO, RegisterUserResponseDTO } from 'dto/authDto';
import { UserRepository } from '../repositories/userRepository';

export default class RegisterUseCase
  implements UseCase<RegisterUserRequestDTO, RegisterUserResponseDTO>
{
  constructor(private userRepository: UserRepository) {}

  async execute(
    registerInfo: RegisterUserRequestDTO,
  ): Promise<RegisterUserResponseDTO> {
    const baseUserInfo = await this.userRepository.register(registerInfo);
    return { ...baseUserInfo, avatar: '' };
  }
}
