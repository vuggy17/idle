import { UseCase } from '@idle/chat/type';
import { LoginUserRequestDTO, LoginUserResponseDTO } from '@idle/model';
import {
  AuthRepository,
  AuthServiceImpl,
} from '../repositories/authRepository';

export default class LoginUseCase
  implements UseCase<LoginUserRequestDTO, LoginUserResponseDTO>
{
  constructor(private userRepository: AuthRepository = AuthServiceImpl) {}

  async execute({
    email,
    password,
  }: LoginUserRequestDTO): Promise<LoginUserResponseDTO> {
    return this.userRepository.login(email, password);
  }
}
