import { UseCase } from '@idle/chat/type';
import {
  ChangePasswordRequestDTO,
  ChangePasswordResponseDTO,
} from '@idle/model';
import {
  AuthRepository,
  AuthServiceImpl,
} from '../repositories/authRepository';

export default class ChangePasswordUseCase
  implements UseCase<ChangePasswordRequestDTO, ChangePasswordResponseDTO>
{
  constructor(private userRepository: AuthRepository = AuthServiceImpl) {}

  async execute(
    data: ChangePasswordRequestDTO,
  ): Promise<ChangePasswordResponseDTO> {
    return this.userRepository.changePassword(data.currentPass, data.newPass);
  }
}
