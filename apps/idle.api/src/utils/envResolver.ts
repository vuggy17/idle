export function resolveEnv(name: string) {
  const isDev = process.env.MODE;
  const prefix = isDev ? 'DEV_' : 'PROD_';

  const value = process.env[`${prefix}${name}`];
  if (value === undefined || value == null)
    throw new Error('Variable not defined ' + name);

  return value;
}
