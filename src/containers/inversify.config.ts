import 'reflect-metadata';
import { Container } from 'inversify';
import { TYPES } from './types';
import { MySimpleUsecaseInterface } from '../usecases/interfaces/Imy-simple-usecase';
import { MySimpleUsecase } from '../usecases/my-simple-usecase';
import { SomeController } from '../controllers/some-controller';


let _appContainer: Container;

const initializeAppContainer = () => {

  if(_appContainer) {
    throw new Error('AppContainer already initialized');
  }
  _appContainer = new Container();

  _appContainer.bind<MySimpleUsecaseInterface>(TYPES.MySimpleUsecaseInterface).to(MySimpleUsecase);
  _appContainer.bind<SomeController>(TYPES.SomeController).to(SomeController).inSingletonScope();
};

const appContainer = () => {
  if (!_appContainer) {
    throw new Error('AppContainer not initialized yet. Call initialize function first.');
  }

  return {
    someController: _appContainer.get<SomeController>(TYPES.SomeController),
    mySimpleUsecase: _appContainer.get<MySimpleUsecaseInterface>(TYPES.MySimpleUsecaseInterface),
  };
};

export { initializeAppContainer, appContainer };
