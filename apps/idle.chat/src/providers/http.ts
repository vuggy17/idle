import axios, { AxiosInstance } from 'axios';

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

  // TODO: add dto
  async disableAccount<Response>(body: { id: string }) {
    return this.client.post<Response>('auth/disable', body);
  }

  async findUserByName<Response>(query: string, abortSignal: AbortSignal) {
    return this.client.get<Response>(
      `https://api.jikan.moe/v4/anime?${query}`,
      {
        signal: abortSignal,
      },
    );
  }
}

const HttpProvider = new HttpClient(axiosClient);
export default HttpProvider;
