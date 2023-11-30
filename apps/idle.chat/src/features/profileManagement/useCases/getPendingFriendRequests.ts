import { SocialServiceImpl } from 'services/socialService';
import { GetPendingFriendRequestResponseDTO } from 'dto/socialDto';
import { UseCase } from 'type';
import { SocialRepository } from '../repositories/socialRepository';

export default class GetPendingFriendRequestUseCase
  implements UseCase<never, GetPendingFriendRequestResponseDTO>
{
  constructor(
    private readonly socialRepository: SocialRepository = SocialServiceImpl,
  ) {}

  execute(): Promise<GetPendingFriendRequestResponseDTO> {
    return this.socialRepository.getPendingFriendRequests();
  }
}
