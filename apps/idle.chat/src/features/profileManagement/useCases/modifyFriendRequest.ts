import { SocialServiceImpl } from 'services/socialService';
import {
  AcceptFriendRequestResponseDTO,
  DeclineFriendRequestResponseDTO,
} from 'dto/socialDto';
import { UseCase } from 'type';
import { SocialRepository } from '../repositories/socialRepository';

type Input = {
  requestId: string;
  action: 'decline' | 'accept';
};

type Output = DeclineFriendRequestResponseDTO | AcceptFriendRequestResponseDTO;

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
    const { isValid } =
      await this.socialRepository.getFriendRequestStatus(requestId);

    if (isValid) {
      if (action === 'accept')
        return this.socialRepository.acceptFriendRequest(requestId);
      if (action === 'decline')
        return this.socialRepository.declineFriendRequest(requestId);
    }
    throw new Error('Cannot accept friend request at the moment');
  }
}
