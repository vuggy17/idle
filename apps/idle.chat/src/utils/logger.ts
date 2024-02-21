/* eslint-disable */
export interface Logger {
  debug: (message: string, ...args: unknown[]) => void;
  info: (message: string, ...args: unknown[]) => void;
  warn: (message: string, ...args: unknown[]) => void;
  error: (message: string, ...args: unknown[]) => void;
}

function withPrefix(pref: string, message: string) {
  if (pref) return `[${pref}] ${message}`;
  return message;
}
export class ConsoleLogger implements Logger {
  constructor(private readonly prefix: string = '') {}
  debug(message: string, ...args: unknown[]) {
    console.debug(withPrefix(this.prefix, message), ...args);
  }

  info(message: string, ...args: unknown[]) {
    console.info(withPrefix(this.prefix, message), ...args);
  }

  warn(message: string, ...args: unknown[]) {
    console.warn(withPrefix(this.prefix, message), ...args);
  }

  error(message: string, ...args: unknown[]) {
    console.error(withPrefix(this.prefix, message), ...args);
  }
}

export class NoopLogger implements Logger {
  constructor(private readonly prefix: string = '') {}

  debug(message: string, ...args: unknown[]) {}

  info(message: string, ...args: unknown[]) {}

  warn(message: string, ...args: unknown[]) {}

  error(message: string, ...args: unknown[]) {}
}
