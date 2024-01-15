import { GetPendingFriendRequestResponseDTO } from '@idle/model';
import { SocialServiceImpl } from '../../../services/social-service';
import { UseCase } from '../../../type';
import { SocialRepository } from '../repositories/social-repository';

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
