import { UseCase } from '@idle/chat/type';
import {
  RegisterUserRequestDTO,
  RegisterUserResponseDTO,
} from '@idle/chat/dto/authDto';
import { AuthServiceImpl } from '@idle/chat/services/authService';
import { UserRepository } from '../repositories/userRepository';

export default class RegisterUseCase
  implements UseCase<RegisterUserRequestDTO, RegisterUserResponseDTO>
{
  constructor(private userRepository: UserRepository = AuthServiceImpl) {}

  async execute(
    registerInfo: RegisterUserRequestDTO,
  ): Promise<RegisterUserResponseDTO> {
    const baseUserInfo = await this.userRepository.register(registerInfo);
    return { ...baseUserInfo, avatar: '' };
  }
}
