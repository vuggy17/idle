import {
  ChangePasswordRequestDTO,
  ChangePasswordResponseDTO,
} from '@idle/model';
import {
  AuthRepository,
  AuthServiceImpl,
} from '../repositories/authRepository';
import { UseCase } from '../../../type';

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
