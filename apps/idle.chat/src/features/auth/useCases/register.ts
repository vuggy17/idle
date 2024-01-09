import { RegisterUserRequestDTO, RegisterUserResponseDTO } from '@idle/model';
import {
  AuthRepository,
  AuthServiceImpl,
} from '../repositories/authRepository';
import { UseCase } from '../../../type';

export default class RegisterUseCase
  implements UseCase<RegisterUserRequestDTO, RegisterUserResponseDTO>
{
  constructor(private userRepository: AuthRepository = AuthServiceImpl) {}

  async execute(
    registerInfo: RegisterUserRequestDTO,
  ): Promise<RegisterUserResponseDTO> {
    const baseUserInfo = await this.userRepository.register(registerInfo);
    return baseUserInfo;
  }
}
