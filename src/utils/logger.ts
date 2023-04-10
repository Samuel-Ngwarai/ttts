import config from 'config';
import { createLogger, LoggerOptions, transports, format } from 'winston';

const version = process.env.npm_package_version;

const logLevel: string = config.get('LOG_LEVEL');

const options: LoggerOptions = {
  exitOnError: false,
  level: logLevel,
  transports: [
    new transports.Console({
      level: logLevel,
      format: format.combine(
        format.colorize(),
        format.simple()
      )
    })
  ],
  defaultMeta: { version }
};

export const logger = createLogger(options);
