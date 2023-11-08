import { resolveEnv } from '../utils/envResolver';

export default () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  appwrite: {
    projectId: resolveEnv('APPWRITE_PROJECT_ID'),
    projectHost: resolveEnv('APPWRITE_PROJECT_HOST'),
    apiKey: resolveEnv('APPWRITE_API_KEY'),
  },
});
