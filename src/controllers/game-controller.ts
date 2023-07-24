import { injectable, inject } from 'inversify';
import { v4 as uuidv4 } from 'uuid';

import { logger } from '../utils/logger';
import { TYPES } from '../containers/types';
import { IUpdateBoardUsecase } from '../usecases/interfaces/IUpdate-board';
import { CacheService } from '../services/cache-service';
import { SessionData } from '../usecases/update-board-usecase';

@injectable()
export class GameController {
  @inject(TYPES.UpdateBoardUsecase) private _updateBoardUsecase: IUpdateBoardUsecase;
  @inject(TYPES.CacheService) private _cacheService: CacheService;
  private waitingPlayer = '';

  private loggerPrefix = 'GameController';
  constructor() { }

  public establishConnection(playerSocket: string) {
    logger.debug(`${this.loggerPrefix}:: establishConnection`, { playerSocket });
    if (!this.waitingPlayer) {
      this.waitingPlayer = playerSocket;
      return {
        result: 'waiting for player B'
      };
    }

    const playerXSocketId = this.waitingPlayer;
    const playerOSocketId = playerSocket;
    this.waitingPlayer = '';

    const sessionId = uuidv4();
    this._cacheService.set<SessionData>(sessionId, {
      board: [['', '', ''],['', '', ''],['', '', '']],
      filledPositions: 0,
      playerXSocketId,
      playerOSocketId
    });

    logger.info(`${this.loggerPrefix}:: connecting player X and O with sockets`, { X: playerXSocketId, O: playerOSocketId });

    return {
      result: 'players connected',
      playerXSocketId,
      playerOSocketId,
      sessionId,
    };
  }

  public async playMove(request: { x: 0 | 1 | 2, y: 0 | 1 | 2, session: string, icon: 'X' | 'O'}) {
    const { x, y, session, icon } = request;
    logger.debug(`${this.loggerPrefix}:: playMove`, { session });

    return this._updateBoardUsecase.execute({ session, x, y, icon });
  }
}
