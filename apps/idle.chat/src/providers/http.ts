import axios, { AxiosInstance } from 'axios';

import {
  DeclineFriendRequestResponseDTO,
  AcceptFriendRequestResponseDTO,
  GetFriendRequestStatusResponseDTO,
  GetPendingFriendRequestResponseDTO,
  DeactivateAccountRequestDTO,
  DeactivateAccountResponseDTO,
  GetUserSearchSuggestionResponseDTO,
  GetUserSearchResultResponseDTO,
} from '@idle/model';

const API_PREFIX = '/api/';
const axiosClient = axios.create({
  baseURL: API_PREFIX,
});

export class HttpClient {
  /**
   *
   * @param client axios instance, which has base url set to `/api/`,
   * which will be resolved with vite proxy config.
   * @see `proxy.conf.json`
   *
   * if you need to request to another endpoint, either modify `proxy.conf.json` or create new axios instance with
   * `axios.create()`
   *
   * @see {@linkcode axios.create}
   */
  constructor(private readonly client: AxiosInstance = axiosClient) {}

  async disableAccount(body: DeactivateAccountRequestDTO) {
    return this.client.post<DeactivateAccountResponseDTO>('auth/disable', body);
  }

  async getUserSearchSuggestions(
    query: string,
    abortSignal: AbortSignal,
  ): Promise<GetUserSearchSuggestionResponseDTO> {
    const apiQuery = new URLSearchParams({ query }).toString();

    const result = await this.client.get<GetUserSearchSuggestionResponseDTO>(
      `users/search-suggestions?${apiQuery}`,
      {
        signal: abortSignal,
      },
    );
    return result.data;
  }

  async getUserSearchResults(
    query: string,
    abortSignal: AbortSignal,
  ): Promise<GetUserSearchResultResponseDTO> {
    const apiQuery = new URLSearchParams({ query }).toString();

    const result = await this.client.get<GetUserSearchResultResponseDTO>(
      `users/search-result?${apiQuery}`,
      {
        signal: abortSignal,
      },
    );
    return result.data;
  }

  async getSearchResultDetail(
    userId: string,
    abortSignal: AbortSignal,
  ): Promise<GetUserSearchResultResponseDTO[number]> {
    const result = await this.client.get<
      GetUserSearchResultResponseDTO[number]
    >(`users/search-result/${userId}`, {
      signal: abortSignal,
    });
    return result.data;
  }

  async getPendingFriendRequests(): Promise<GetPendingFriendRequestResponseDTO> {
    const result =
      await this.client.get<GetPendingFriendRequestResponseDTO>(`invitation`);

    return result.data;
  }

  async getFriendRequestStatus(
    requestId: string,
  ): Promise<GetFriendRequestStatusResponseDTO> {
    const query = new URLSearchParams({ id: requestId }).toString();
    const result = await this.client.get<GetFriendRequestStatusResponseDTO>(
      `invitation?${query}`,
    );
    return result.data;
  }

  async acceptFriendRequest(requestId: string) {
    const result = await this.client.post<AcceptFriendRequestResponseDTO>(
      'invitation',
      {
        action: 'accept',
        requestId,
      },
    );
    return result.data;
  }

  async declineFriendRequest(requestId: string) {
    const result = await this.client.post<DeclineFriendRequestResponseDTO>(
      'invitation',
      {
        action: 'decline',
        requestId,
      },
    );
    return result.data;
  }
}

const HttpProvider = new HttpClient(axiosClient);
export default HttpProvider;
