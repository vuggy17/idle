import { FriendRequestResponseDTO } from '@idle/model';
import { SocialServiceImpl } from '../../../services/social-service';
import { UseCase } from '../../../type';
import { SocialRepository } from '../repositories/social-repository';

type Input = {
  requestId: string;
  action: 'decline' | 'accept' | 'cancel';
};

type Output = FriendRequestResponseDTO;

/**
 * Accept friend request of a user
 * @description Alternative flow:
 * - The friend request has already been accepted or declined.
 * - The user who sent the friend request has since deactivated their account.
 * - The platform’s server is temporarily down, preventing any actions.
 */
export default class ModifyFriendRequestUseCase
  implements UseCase<Input, Output>
{
  constructor(
    private readonly socialRepository: SocialRepository = SocialServiceImpl,
  ) {}

  async execute({ requestId, action }: Input): Promise<Output> {
    const request =
      await this.socialRepository.getFriendRequestStatus(requestId);

    // A request is valid when it is in pending state
    const isValid = request.status === 'pending';

    if (isValid) {
      if (action === 'accept')
        return this.socialRepository.acceptFriendRequest(requestId);
      if (action === 'decline')
        return this.socialRepository.declineFriendRequest(requestId);
      if (action === 'cancel')
        return this.socialRepository.cancelFriendRequest(requestId);
    }
    throw new Error('Cannot accept friend request at the moment');
  }
}
