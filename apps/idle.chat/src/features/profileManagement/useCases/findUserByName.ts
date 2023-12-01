import {
  GetUserSearchSuggestionRequestDTO,
  GetUserSearchSuggestionResponseDTO,
} from '@idle/model';
import { SocialServiceImpl } from '@idle/chat/services/socialService';
import { UseCase } from '../../../type';
import { SocialRepository } from '../repositories/socialRepository';

export default class FindUserByNameUseCase
  implements
    UseCase<
      GetUserSearchSuggestionRequestDTO,
      GetUserSearchSuggestionResponseDTO
    >
{
  constructor(
    private readonly socialRepository: SocialRepository = SocialServiceImpl,
  ) {}

  execute(
    useCaseInput: GetUserSearchSuggestionRequestDTO,
  ): Promise<GetUserSearchSuggestionResponseDTO> {
    return this.socialRepository.getUserSearchSuggestions(useCaseInput);
  }
}
