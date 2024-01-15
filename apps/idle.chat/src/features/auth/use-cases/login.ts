import { LoginUserRequestDTO, LoginUserResponseDTO } from '@idle/model';
import { UseCase } from '../../../type';
import {
  AuthRepository,
  AuthServiceImpl,
} from '../repositories/auth-repository';

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
