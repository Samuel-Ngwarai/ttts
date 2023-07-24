import { IConfigObject } from './config-i';

const defaultConfig: IConfigObject = {
  PORT: 3001,
  LOG_LEVEL: 'info',
  CREATE_SWAGGER_FILE: false,
  CACHE_STD_TTL: 600
};

export = defaultConfig;
