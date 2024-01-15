import { FriendRequestResponseDTO, ID } from '@idle/model';
import { SocialServiceImpl } from '../../../services/social-service';
import { UseCase } from '../../../type';
import { SocialRepository } from '../repositories/social-repository';

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
