import { UseCase } from 'type';
import { UserRepository } from '../repositories/userRepository';

export class RegisterUseCase
  implements
    UseCase<
      { email: string; password: string },
      { email: string; password: string }
    >
{
  constructor(private userRepository: UserRepository) {}

  async execute(registerInfo: {
    email: string;
    password: string;
  }): Promise<{ email: string; password: string }> {
    return await this.userRepository.register(registerInfo);
  }
}
