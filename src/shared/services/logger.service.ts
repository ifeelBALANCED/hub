export interface Logger {
  info: (message: string, ...args: any[]) => void
  warn: (message: string, ...args: any[]) => void
  error: (message: string, ...args: any[]) => void
  debug: (message: string, ...args: any[]) => void
}

class ConsoleLogger implements Logger {
  info(message: string, ...args: any[]) {
    // eslint-disable-next-line no-console
    console.info(`[INFO] ${message}`, ...args)
  }

  warn(message: string, ...args: any[]) {
    // eslint-disable-next-line no-console
    console.warn(`[WARN] ${message}`, ...args)
  }

  error(message: string, ...args: any[]) {
    // eslint-disable-next-line no-console
    console.error(`[ERROR] ${message}`, ...args)
  }

  debug(message: string, ...args: any[]) {
    // eslint-disable-next-line no-console
    console.debug(`[DEBUG] ${message}`, ...args)
  }
}

export const logger = new ConsoleLogger()
