import { injectable, inject } from 'inversify';
import { Request, Response, NextFunction } from 'express';

import { logger } from '../utils/logger';
import { TYPES } from '../containers/types';
import { MySimpleUsecaseInterface } from '../usecases/interfaces/Imy-simple-usecase';

@injectable()
export class SomeController {
  @inject(TYPES.MySimpleUsecaseInterface) private _mySimpleUsecase: MySimpleUsecaseInterface;

  private loggerPrefix = 'SomeController';
  constructor() {}

  public async doSomethingSimple(_: Request, res: Response, next: NextFunction): Promise<void> {
    logger.info(`${this.loggerPrefix}::doSomethingSimple`);
    try {
      const response = await this._mySimpleUsecase.execute();
      res.json(response);
    } catch (error) {
      logger.error(`${this.loggerPrefix}::doSomethingSimple, error occurred error: ${error}`);
      next(error);
    }
  }
}
