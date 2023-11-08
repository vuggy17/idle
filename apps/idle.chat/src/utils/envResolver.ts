export function resolveEnv(name: string) {
  const isDev = import.meta.env.DEV;
  const prefix = isDev ? 'DEV_' : 'PROD_';

  const value = import.meta.env[`${prefix}${name}`];
  if (value === undefined || value == null)
    throw new Error('Variable not defined ' + name);

  return value;
}
