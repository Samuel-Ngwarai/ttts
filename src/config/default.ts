import { IConfigObject } from './config-i';

const defaultConfig: IConfigObject = {
  PORT: 3001,
  LOG_LEVEL: 'info',
  CREATE_SWAGGER_FILE: false,
  CACHE_STD_TTL: 600,
  MAX_WAITING_TIME_FOR_PLAYER_2: 30,
  SENTRY_DSN: '',
  SENTRY_TRACES_SAMPLE_RATE: 1.0,
  ENVIRONMENT: 'development'
};

export = defaultConfig;
