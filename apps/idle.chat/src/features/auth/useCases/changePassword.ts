import { UseCase } from 'type';
import {
  ChangePasswordRequestDTO,
  ChangePasswordResponseDTO,
} from 'dto/authDto';
import { UserRepository } from '../repositories/userRepository';

export default class ChangePasswordUseCase
  implements UseCase<ChangePasswordRequestDTO, ChangePasswordResponseDTO>
{
  constructor(private userRepository: UserRepository) {}

  async execute(
    data: ChangePasswordRequestDTO,
  ): Promise<ChangePasswordResponseDTO> {
    return this.userRepository.changePassword(data.currentPass, data.newPass);
  }
}
