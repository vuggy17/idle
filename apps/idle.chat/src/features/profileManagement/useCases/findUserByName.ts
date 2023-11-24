import {
  FindUserByNameRequestDTO,
  FindUserByNameResponseDTO,
} from 'dto/socialDto';
import { SocialServiceImpl } from 'services/socialService';
import { UseCase } from '../../../type';
import { SocialRepository } from '../repositories/socialRepository';

export default class FindUserByNameUseCase
  implements UseCase<FindUserByNameRequestDTO, FindUserByNameResponseDTO>
{
  constructor(
    private readonly socialRepository: SocialRepository = SocialServiceImpl,
  ) {}

  execute(
    useCaseInput: FindUserByNameRequestDTO,
  ): Promise<FindUserByNameResponseDTO> {
    return this.socialRepository.findUserByName(useCaseInput);
  }
}
