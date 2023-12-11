import { UseCase } from '@idle/chat/type';
import {
  ChangePasswordRequestDTO,
  ChangePasswordResponseDTO,
} from '@idle/model';
import { AuthServiceImpl } from '@idle/chat/services/authService';
import { UserRepository } from '../repositories/userRepository';

export default class ChangePasswordUseCase
  implements UseCase<ChangePasswordRequestDTO, ChangePasswordResponseDTO>
{
  constructor(private userRepository: UserRepository = AuthServiceImpl) {}

  async execute(
    data: ChangePasswordRequestDTO,
  ): Promise<ChangePasswordResponseDTO> {
    return this.userRepository.changePassword(data.currentPass, data.newPass);
  }
}
