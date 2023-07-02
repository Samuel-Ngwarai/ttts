import { injectable } from 'inversify';
import NodeCache from 'node-cache';

import { logger } from '../utils/logger';
import { ICacheService } from './interfaces/Icache-service';

@injectable()
export class CacheService implements ICacheService {
  private cache: NodeCache;

  private loggerPrefix = 'CacheService';
  constructor() {
    logger.debug(`${this.loggerPrefix}::constructor`);
    this.cache = new NodeCache();
  }

  public set<T>(key: string, item: T) {
    logger.debug(`${this.loggerPrefix}::add, adding item with details`, {
      key,
      item
    });
    this.cache.set(key, item);
  }

  public get<T>(key: string) {
    logger.debug(`${this.loggerPrefix}::get, getting item with key`, { key });
    return this.cache.get<T>(key);
  }

  public delete(key: string) {
    logger.debug(`${this.loggerPrefix}::add, deleting item with key`, { key });
    return this.cache.del(key);
  }

  public isEmpty() {
    return this.cache.keys().length === 0;
  }

  public has(key: string) {
    return this.cache.has(key);
  }
}
