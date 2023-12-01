import { UseCase } from '@idle/chat/type';
import {
  DeactivateAccountRequestDTO,
  DeactivateAccountResponseDTO,
} from '@idle/chat/dto/authDto';
import { AuthServiceImpl } from '@idle/chat/services/authService';
import { UserRepository } from '../repositories/userRepository';

export default class DeactivateAccountUseCase
  implements UseCase<DeactivateAccountRequestDTO, DeactivateAccountResponseDTO>
{
  constructor(private userRepository: UserRepository = AuthServiceImpl) {}

  async execute(
    data: DeactivateAccountRequestDTO,
  ): Promise<DeactivateAccountResponseDTO> {
    // loginCheck
    await this.userRepository.login(data.email, data.password);

    const user = await this.userRepository.getCurrentUser();
    return this.userRepository.disableAccount(user.$id);
  }
}
