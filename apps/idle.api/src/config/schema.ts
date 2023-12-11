import { resolveEnv } from '../utils/envResolver';

export default () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  appwrite: {
    projectId: resolveEnv('APPWRITE_PROJECT_ID'),
    projectHost: resolveEnv('APPWRITE_PROJECT_HOST'),
    apiKey: resolveEnv('APPWRITE_API_KEY'),
  },
  firebase: {
    type: resolveEnv('FIREBASE_TYPE'),
    projectId: resolveEnv('FIREBASE_PROJECT_ID'),
    privateKeyId: resolveEnv('FIREBASE_PRIVATE_KEY_ID'),
    privateKey: resolveEnv('FIREBASE_PRIVATE_KEY'),
    clientEmail: resolveEnv('FIREBASE_CLIENT_EMAIL'),
    clientId: resolveEnv('FIREBASE_CLIENT_ID'),
    authUri: resolveEnv('FIREBASE_UTH_URI'),
    tokenUri: resolveEnv('FIREBASE_TOKEN_URI'),
    authProviderX509CertUrl: resolveEnv('FIREBASE_AUTH_CERT_URL'),
    clientX509CertUrl: resolveEnv('FIREBASE_CLIENT_CERT_URL'),
    universeDomain: resolveEnv('FIREBASE_UNIVERSAL_DOMAIN'),
  },
});
