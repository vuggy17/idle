import { SocialServiceImpl } from '@idle/chat/services/socialService';
import { GetPendingFriendRequestResponseDTO } from '@idle/model';
import { UseCase } from '@idle/chat/type';
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
