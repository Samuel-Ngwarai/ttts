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

  private logPrefix = 'GameController';
  constructor() { }

  /**
   * Establish connection between 2 players represented by different sockets.
   */
  public establishConnection(playerSocket: string) {
    logger.debug(`${this.logPrefix}::establishConnection`, { playerSocket });
    const waitingPlayerKey = 'waitingPlayer';
    if (!this._cacheService.has(waitingPlayerKey)) {
      const waitingTimeForOtherPlayer = 30;
      this._cacheService.set<string>(waitingPlayerKey, playerSocket, waitingTimeForOtherPlayer);
      return {
        result: 'waiting for player B'
      };
    }

    const playerXSocketId = this._cacheService.get<string>(waitingPlayerKey);
    const playerOSocketId = playerSocket;
    this._cacheService.delete(waitingPlayerKey);

    const sessionId = uuidv4();
    this._cacheService.set<SessionData>(sessionId, {
      board: [['', '', ''],['', '', ''],['', '', '']],
      filledPositions: 0,
      playerXSocketId,
      playerOSocketId
    });

    logger.info(`${this.logPrefix}::establishConnection, connecting player X and O with sockets`, { X: playerXSocketId, O: playerOSocketId });

    return {
      result: 'players connected',
      playerXSocketId,
      playerOSocketId,
      sessionId,
    };
  }

  public async playMove(request: { x: 0 | 1 | 2, y: 0 | 1 | 2, session: string, icon: 'X' | 'O'}) {
    const { x, y, session, icon } = request;
    logger.debug(`${this.logPrefix}::playMove`, { session });

    return this._updateBoardUsecase.execute({ session, x, y, icon });
  }
}
