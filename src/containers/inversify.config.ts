import 'reflect-metadata';
import { Container } from 'inversify';
import { TYPES } from './types';
import { GameController } from '../controllers/game-controller';
import { IUpdateBoardUsecase } from '../usecases/interfaces/IUpdate-board';
import { UpdateBoardUsecase } from '../usecases/update-board-usecase';
import { CacheService } from '../services/cache-service';
import { ICacheService } from '../services/interfaces/Icache-service';


let _appContainer: Container;

const initializeAppContainer = () => {

  if(_appContainer) {
    throw new Error('AppContainer already initialized');
  }
  _appContainer = new Container();

  _appContainer.bind<IUpdateBoardUsecase>(TYPES.UpdateBoardUsecase).to(UpdateBoardUsecase);
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
    updateBoardUsecase: _appContainer.get<IUpdateBoardUsecase>(TYPES.UpdateBoardUsecase),
    cacheService: _appContainer.get<ICacheService>(TYPES.CacheService)
  };
};

export { initializeAppContainer, appContainer };
