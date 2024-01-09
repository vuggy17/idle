import { FriendRequestResponseDTO, ID } from '@idle/model';
import { SocialServiceImpl } from '../../../services/socialService';
import { UseCase } from '../../../type';
import { SocialRepository } from '../repositories/socialRepository';

type Input = { receiver: ID };

type Output = FriendRequestResponseDTO;

export default class CreateFriendRequestUseCase
  implements UseCase<Input, Output>
{
  constructor(
    private readonly socialRepository: SocialRepository = SocialServiceImpl,
  ) {}

  async execute({ receiver }: Input): Promise<Output> {
    return this.socialRepository.createFriendRequest(receiver);
  }
}
