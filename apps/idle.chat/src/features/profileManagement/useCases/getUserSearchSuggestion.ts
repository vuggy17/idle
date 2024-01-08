import {
  GetUserSearchSuggestionRequestDTO,
  GetUserSearchSuggestionResponseDTO,
} from '@idle/model';
import { SocialServiceImpl } from '../../../services/socialService';
import { UseCase, WithAbortSignal } from '../../../type';
import { SocialRepository } from '../repositories/socialRepository';

type Input = WithAbortSignal<GetUserSearchSuggestionRequestDTO>;

type Output = GetUserSearchSuggestionResponseDTO;

export default class GetUserSearchSuggestionUseCase
  implements UseCase<Input, Output>
{
  constructor(
    private readonly socialRepository: SocialRepository = SocialServiceImpl,
  ) {}

  execute(useCaseInput: Input): Promise<Output> {
    return this.socialRepository.getUserSearchSuggestions(
      { q: useCaseInput.q },
      useCaseInput.abortSignal,
    );
  }
}
