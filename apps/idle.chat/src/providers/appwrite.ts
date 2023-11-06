import { Client } from 'appwrite';

const client = new Client();
const endpoint = import.meta.env.VITE_APPWRITE_PROJECT_HOST;
console.log('🚀 ~ file: appwrite.ts:5 ~ endpoint:', endpoint);
const projectId = import.meta.env.VITE_APPWRITE_PROJECT_ID;
console.log('🚀 ~ file: appwrite.ts:7 ~ projectId:', projectId);

if (!endpoint || !projectId) {
  throw new Error('Please provide appwrite projectId or project url');
}

client.setEndpoint(endpoint).setProject(projectId);

export const AppWriteProvider = client;
