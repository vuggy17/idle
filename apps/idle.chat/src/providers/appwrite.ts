import { Client } from 'appwrite';
import resolveEnv from '../utils/envResolver';

const endpoint = resolveEnv('APPWRITE_PROJECT_HOST');
const projectId = resolveEnv('APPWRITE_PROJECT_ID');

const client = new Client();
client.setEndpoint(endpoint).setProject(projectId);

export const AppWriteProvider = client;

export type AppWriteErrorResponse = {
  code: number;
  message: string;
  type: string;
  version: string;
};
