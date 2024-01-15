import { DeactivateAccountResponseDTO } from '@idle/model';
import {
  AuthRepository,
  AuthServiceImpl,
} from '../repositories/auth-repository';
import { UseCase } from '../../../type';

type Input = { email: string; password: string };
type Output = DeactivateAccountResponseDTO;

export default class DeactivateAccountUseCase
  implements UseCase<Input, Output>
{
  constructor(private userRepository: AuthRepository = AuthServiceImpl) {}

  async execute(data: Input): Promise<Output> {
    // loginCheck
    await this.userRepository.login(data.email, data.password);

    const user = await this.userRepository.getCurrentUser();
    return this.userRepository.disableAccount(user.id);
  }
}
