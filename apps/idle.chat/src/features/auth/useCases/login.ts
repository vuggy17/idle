import { UseCase } from '@idle/chat/type';
import {
  LoginUserRequestDTO,
  LoginUserResponseDTO,
} from '@idle/chat/dto/authDto';
import { AuthServiceImpl } from '@idle/chat/services/authService';
import { UserRepository } from '../repositories/userRepository';

export default class LoginUseCase
  implements UseCase<LoginUserRequestDTO, LoginUserResponseDTO>
{
  constructor(private userRepository: UserRepository = AuthServiceImpl) {}

  async execute({
    email,
    password,
  }: LoginUserRequestDTO): Promise<LoginUserResponseDTO> {
    return this.userRepository.login(email, password);
  }
}
