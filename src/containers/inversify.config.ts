import 'reflect-metadata';
import { Container } from 'inversify';
import { TYPES } from './types';
import { MySimpleUsecaseInterface } from '../usecases/interfaces/Imy-simple-usecase';
import { MySimpleUsecase } from '../usecases/my-simple-usecase';
import { GameController } from '../controllers/game-controller';
import { CacheService } from '../services/cache-service';


let _appContainer: Container;

const initializeAppContainer = () => {

  if(_appContainer) {
    throw new Error('AppContainer already initialized');
  }
  _appContainer = new Container();

  _appContainer.bind<MySimpleUsecaseInterface>(TYPES.MySimpleUsecaseInterface).to(MySimpleUsecase);
  _appContainer.bind<GameController>(TYPES.GameController).to(GameController).inSingletonScope();

  const cacheService = new CacheService();
  _appContainer.bind<CacheService>(TYPES.CacheService).toConstantValue(cacheService);
};

const appContainer = () => {
  if (!_appContainer) {
    throw new Error('AppContainer not initialized yet. Call initialize function first.');
  }

  return {
    gameController: _appContainer.get<GameController>(TYPES.GameController),
    mySimpleUsecase: _appContainer.get<MySimpleUsecaseInterface>(TYPES.MySimpleUsecaseInterface),
    cacheService: _appContainer.get<CacheService>(TYPES.CacheService),
  };
};

export { initializeAppContainer, appContainer };
