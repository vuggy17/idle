import { UseCase } from 'type';
import { DeleteAccountRequestDTO, DeleteAccountResponseDTO } from 'dto/authDto';
import { AuthServiceImpl } from 'services/authService';
import { UserRepository } from '../repositories/userRepository';

export default class DeleteAccountUseCase
  implements UseCase<DeleteAccountRequestDTO, DeleteAccountResponseDTO>
{
  constructor(private userRepository: UserRepository = AuthServiceImpl) {}

  async execute(
    data: DeleteAccountRequestDTO,
  ): Promise<DeleteAccountResponseDTO> {
    // loginCheck
    await this.userRepository.login(data.email, data.password);

    const user = await this.userRepository.getCurrentUser();
    return this.userRepository.disableAccount(user.$id);
  }
}
