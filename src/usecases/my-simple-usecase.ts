
import { injectable } from 'inversify';
import { MySimpleUsecaseInterface } from './interfaces/Imy-simple-usecase';

@injectable()
export class MySimpleUsecase implements MySimpleUsecaseInterface {
  public async execute(): Promise<number> {
    return 1;
  }
}