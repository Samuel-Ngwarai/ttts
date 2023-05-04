import { CacheService } from '../../cache-service';

describe(__filename, () => {
  const cacheService = new CacheService();
  const key = 'someRandomKey';
  const data = 'someRandom Data';

  beforeEach(() => {
    cacheService['cache'].flushAll();
  });

  it('should store items', () => {
    expect(cacheService['cache'].get(key)).toBe(undefined);
    cacheService.set(key, data);
    expect(cacheService['cache'].get(key)).toBe(data);
  });

  it('should should retrieve stored items', () => {
    cacheService['cache'].set(key, data);

    expect(cacheService.get(key)).toBe(data);
  });

  it('should delete stored items', () => {
    cacheService['cache'].set(key, data);
    expect(cacheService['cache'].get(key)).toBe(data);
    cacheService.delete(key);
    expect(cacheService['cache'].get(key)).toBe(undefined);
  });

  it('should return true if store is empty', () => {
    cacheService['cache'].set(key, data);
    expect(cacheService.isEmpty()).toBe(false);
    cacheService['cache'].del(key);
    expect(cacheService.isEmpty()).toBe(true);
  });

  it('should get the first item and delete it from cache', () => {
    cacheService['cache'].mset([{ key, val: data }, { key: 'sKey', val: 'sData' }]);
    expect(cacheService['cache'].keys().length).toBe(2);
    const res = cacheService.getAndDelete();
    expect(res).toBe(data);
    expect(cacheService['cache'].keys().length).toBe(1);
  });
});
