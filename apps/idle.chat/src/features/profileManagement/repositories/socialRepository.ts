import { FindUserByNameResponseDTO } from 'dto/socialDto';
import { FindUserByNameRequestDTO } from '../../../dto/socialDto';

export interface SocialRepository {
  findUserByName(
    data: FindUserByNameRequestDTO,
  ): Promise<FindUserByNameResponseDTO>;
}
