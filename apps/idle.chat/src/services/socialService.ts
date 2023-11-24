import axios from 'axios';
import {
  FindUserByNameRequestDTO,
  FindUserByNameResponseDTO,
} from 'dto/socialDto';
import { SocialRepository } from 'features/profileManagement/repositories/socialRepository';
import { HttpClient } from 'providers/http';

export default class SocialService implements SocialRepository {
  constructor(private httpGateway: HttpClient) {}

  async findUserByName(
    data: FindUserByNameRequestDTO,
  ): Promise<FindUserByNameResponseDTO> {
    const apiQuery = `${new URLSearchParams({ q: data.q }).toString()}&sfw`;
    const result = await this.httpGateway.findUserByName<{ data: any[] }>(
      apiQuery,
      data.abortSignal,
    );

    // map api data to data
    return result.data.data.map((user) => ({
      name: user.title,
      avatar: user.images.jpg.small_image_url,
      status: user.background,
    }));
  }
}

export const SocialServiceImpl = new SocialService(
  new HttpClient(axios.create()),
);
