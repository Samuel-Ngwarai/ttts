import { injectable, inject } from 'inversify';
import { Request, Response, NextFunction } from 'express';

import { logger } from '../utils/logger';
import { TYPES } from '../containers/types';
import { IUpdateBoardUsecase } from '../usecases/interfaces/IUpdate-board';

@injectable()
export class GameController {
  @inject(TYPES.UpdateBoardUsecase) private _updateBoardUsecase: IUpdateBoardUsecase;

  private loggerPrefix = 'GameController';
  constructor() { }

  public async playMove(req: Request, res: Response, next: NextFunction): Promise<any> {
    logger.debug(`${this.loggerPrefix}:: playMove`);
    const { x, y, player } = req.body;

    return this._updateBoardUsecase.execute({ session: player.session, x, y, playerIcon: player.icon });
  }
}
