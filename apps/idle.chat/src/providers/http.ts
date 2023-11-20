import axios, { AxiosInstance } from 'axios';

const API_PREFIX = '/api/';
const axiosClient = axios.create({
  baseURL: API_PREFIX,
});

export class HttpClient {
  constructor(private readonly client: AxiosInstance = axiosClient) {}

  // TODO: add dto
  async disableAccount<Response>(body: { id: string }) {
    return this.client.post<Response>('auth/disable', body);
  }
}

const HttpProvider = new HttpClient(axiosClient);
export default HttpProvider;
