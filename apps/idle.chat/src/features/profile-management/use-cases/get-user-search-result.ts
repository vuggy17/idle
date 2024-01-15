import { GetUserSearchResultResponseDTO } from '@idle/model';
import { SocialServiceImpl } from '../../../services/social-service';
import { UseCase } from '../../../type';
import { SocialRepository } from '../repositories/social-repository';

type Input = {
  q: string;
  abortSignal: AbortSignal;
  // pagination
  start?: string;
  end?: string;
};

type Output = GetUserSearchResultResponseDTO;

export default class GetUserSearchResultUseCase
  implements UseCase<Input, Output>
{
  constructor(
    private readonly socialRepository: SocialRepository = SocialServiceImpl,
  ) {}

  execute(useCaseInput: Input): Promise<Output> {
    return this.socialRepository.getUserSearchResult(
      { q: useCaseInput.q },
      useCaseInput.abortSignal,
    );
  }
}
