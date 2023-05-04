import { injectable, inject } from 'inversify';
import { v4 as uuidv4 } from 'uuid';
import { Request, Response, NextFunction } from 'express';

import { logger } from '../utils/logger';
import { TYPES } from '../containers/types';
import { ICacheService } from '../services/interfaces/Icache-service';

@injectable()
export class GameController {
  @inject(TYPES.CacheService) private cacheService: ICacheService;

  private lgPref = 'GameController';
  constructor() {
  }

  public establishConnection(clientID: string) {
      logger.info(`${this.lgPref}::establishConnection, establishing connection for clientID`, { clientID });
      if (this.cacheService.isEmpty() === true) {
          logger.debug(`${this.lgPref}::establishConnection, Waiting for second player`);
          this.cacheService.set(clientID, clientID);

          return 'waiting for player B';
      }
      logger.debug(`${this.lgPref}::establishConnection, Connecting two players`);

      // generate id
      const connectionId = uuidv4();

      const playerA = this.cacheService.getAndDelete();

      return {
          playerA,
          playerB: clientID,
          connectionId,
      };
  }
}
