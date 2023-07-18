import { appContainer, initializeAppContainer } from '../../../containers/inversify.config';
import { ICacheService } from '../../interfaces/Icache-service';

describe(__filename, () => {
  let cacheService: ICacheService;
  beforeAll(async () => {
    await initializeAppContainer();

    cacheService = appContainer().cacheService;
  });

  it('stores and retrieves cache data', async () => {
    const data = {
      data: ['some', 'data', 'is', 'here']
    };
    cacheService.set<{ data: string[] }>('key', data);

    expect(cacheService.get('key')).toBe(data);
  });

});