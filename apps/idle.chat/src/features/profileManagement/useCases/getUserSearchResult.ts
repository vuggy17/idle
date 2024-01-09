import { GetUserSearchResultResponseDTO } from '@idle/model';
import { SocialServiceImpl } from '../../../services/socialService';
import { UseCase } from '../../../type';
import { SocialRepository } from '../repositories/socialRepository';

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
