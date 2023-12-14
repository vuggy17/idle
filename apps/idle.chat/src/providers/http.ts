import axios, { AxiosError, AxiosInstance } from 'axios';

import {
  GetFriendRequestStatusResponseDTO,
  GetPendingFriendRequestResponseDTO,
  DeactivateAccountRequestDTO,
  DeactivateAccountResponseDTO,
  GetUserSearchSuggestionResponseDTO,
  GetUserSearchResultResponseDTO,
  SaveFCMTokenRequestDTO,
  GetUserSearchSuggestionRequestDTO,
  GetUserSearchResultRequestDTO,
  UserDTO,
  CreateFriendRequestRequestDTO,
  ModifyFriendRequestDTO,
  FriendRequestResponseDTO,
} from '@idle/model';
import { Account } from 'appwrite';
import { WithAbortSignal } from '../type';
import { AppWriteProvider } from './appwrite';

const API_PREFIX = '/api/';
const axiosClient = axios.create({
  baseURL: API_PREFIX,
});

axiosClient.interceptors.request.use((config) => {
  const tokenOrNull = localStorage.getItem('jwt') ?? '';
  const userIdOrNull = localStorage.getItem('user_id') ?? '';
  if (tokenOrNull) {
    config.headers.setAuthorization(`Bearer ${JSON.parse(tokenOrNull)}`);
  }
  if (userIdOrNull) {
    config.headers.set('x-user-id', JSON.stringify(userIdOrNull));
  }
  return config;
});
axiosClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config!;
    const { response } = error;
    if (
      response?.status === 401 &&
      (response?.data as any).type === 'user_jwt_invalid'
    ) {
      // get new token
      const token = await new Account(AppWriteProvider).createJWT();
      localStorage.setItem('jwt', JSON.stringify(token.jwt));
      try {
        const retry = await axiosClient(originalRequest);
        return retry;
      } catch (err) {
        console.log(err);
      }
    }
    return Promise.reject(error);
  },
);

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

  async getUserSearchSuggestions({
    q,
    abortSignal,
  }: WithAbortSignal<GetUserSearchSuggestionRequestDTO>): Promise<GetUserSearchSuggestionResponseDTO> {
    const apiQuery = new URLSearchParams({ q }).toString();

    const result = await this.client.get<GetUserSearchSuggestionResponseDTO>(
      `users/search-suggestions?${apiQuery}`,
      {
        signal: abortSignal,
      },
    );
    return result.data;
  }

  async getUserSearchResults({
    q,
    abortSignal,
  }: WithAbortSignal<GetUserSearchResultRequestDTO>): Promise<GetUserSearchResultResponseDTO> {
    const apiQuery = new URLSearchParams({ q }).toString();

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
      `friends/invitation?${query}`,
    );
    return result.data;
  }

  async acceptFriendRequest(requestId: string) {
    const result = await this.client.post<FriendRequestResponseDTO>(
      'friends/invitation',
      {
        action: 'accept',
        requestId,
      },
    );
    return result.data;
  }

  async declineFriendRequest(requestId: string) {
    const result = await this.client.post<FriendRequestResponseDTO>(
      'friends/invitation',
      {
        action: 'decline',
        requestId,
      },
    );
    return result.data;
  }

  async saveFCMToken(body: SaveFCMTokenRequestDTO) {
    return this.client.post<unknown>('notification/fcm', {
      body,
    });
  }

  async getMe(): Promise<UserDTO> {
    const result = await this.client.get<UserDTO>('auth/me');
    return result.data;
  }

  async sendFriendRequest(body: CreateFriendRequestRequestDTO) {
    const result = await this.client.post<FriendRequestResponseDTO>(
      'friends/invitation/create',
      body,
    );
    return result.data;
  }

  async modifyFriendRequest(
    body: ModifyFriendRequestDTO,
  ): Promise<FriendRequestResponseDTO> {
    const result = await this.client.post<FriendRequestResponseDTO>(
      'friends/invitation',
      body,
    );
    return result.data;
  }
}

const HttpProvider = new HttpClient(axiosClient);
export default HttpProvider;
