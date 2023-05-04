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

  public set(key: string, item: string) {
    logger.debug(`${this.loggerPrefix}::add, adding item with details`, { key, item });
    this.cache.set(key, item);
  }

  public get(key: string) {
    logger.debug(`${this.loggerPrefix}::get, getting item with key`, { key });
    return this.cache.get<string>(key);
  }

  public delete(key: string) {
    logger.debug(`${this.loggerPrefix}::add, deleting item with key`, { key });
    return this.cache.del(key);
  }

  public getAndDelete() {
    const itemKey = this.cache.keys()[0];
    const item = this.get(itemKey);
    this.cache.del(itemKey);

    return item;
  }

  public isEmpty() {
    return this.cache.keys().length === 0;
  }
}
