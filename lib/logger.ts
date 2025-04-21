type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LoggerOptions {
  level: LogLevel;
  module: string;
}

type LogData = Record<string, unknown>;

class Logger {
  private static instance: Logger;
  private level: LogLevel = 'info';
  private isDevelopment = process.env.NODE_ENV === 'development';

  private constructor() {}

  static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  private shouldLog(level: LogLevel): boolean {
    const levels: Record<LogLevel, number> = {
      debug: 0,
      info: 1,
      warn: 2,
      error: 3,
    };
    return this.isDevelopment || levels[level] >= levels[this.level];
  }

  private formatMessage(level: LogLevel, module: string, message: string, data?: LogData): string {
    const timestamp = new Date().toISOString();
    return `[${timestamp}] [${level.toUpperCase()}] [${module}] ${message}${data ? ` ${JSON.stringify(data)}` : ''}`;
  }

  debug(module: string, message: string, data?: LogData): void {
    if (this.shouldLog('debug')) {
      console.debug(this.formatMessage('debug', module, message, data));
    }
  }

  info(module: string, message: string, data?: LogData): void {
    if (this.shouldLog('info')) {
      console.info(this.formatMessage('info', module, message, data));
    }
  }

  warn(module: string, message: string, data?: LogData): void {
    if (this.shouldLog('warn')) {
      console.warn(this.formatMessage('warn', module, message, data));
    }
  }

  error(module: string, message: string, error?: Error | LogData): void {
    if (this.shouldLog('error')) {
      // Convert Error object to LogData if needed
      const logData: LogData | undefined = error instanceof Error
        ? {
            name: error.name,
            message: error.message,
            stack: error.stack,
          }
        : error;
      
      console.error(this.formatMessage('error', module, message, logData));
    }
  }
}

export const logger = Logger.getInstance(); 