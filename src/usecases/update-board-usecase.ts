
import { inject, injectable } from 'inversify';
import { IUpdateBoardUsecase, UpdateBoardResponse } from './interfaces/IUpdate-board';
import { TYPES } from '../containers/types';
import { CacheService } from '../services/cache-service';
import { logger } from '../utils/logger';

type Board = ('X' | 'O' | '')[][];

export type SessionData = {
  board: Board,
  filledPositions: number,
  playerXSocketId: string,
  playerOSocketId: string,
}

@injectable()
export class UpdateBoardUsecase implements IUpdateBoardUsecase {
  @inject(TYPES.CacheService) private _cacheService: CacheService;

  /**
   * Checks whether all arguments provided are identical strings
   */
  private allEqual(first: string, second: string, third: string, letter: string) {
    return first === second && second === third && third === letter;
  }

  /**
   * Given a tic-tac-toe board and last filled in position and letter,
   * checks what the current status of the board is
   */
  private checkForWin(x: number, y: number, letter: string, board: string[][]) {
    // check horizontal and vertical
    if (this.allEqual(board[0][y], board[1][y], board[2][y], letter)
            || this.allEqual(board[x][0], board[x][1], board[x][2], letter)) return true;

    // check diagonal
    const notOnDiagonals = ['1:0', '0:1', '2:1', '1:2'];
    if (notOnDiagonals.indexOf(`${x}:${y}`) !== -1) return false;

    // forward diagonal
    if (this.allEqual(board[0][0], board[1][1], board[2][2], letter)) return true;

    // backwards diagonal
    if (this.allEqual(board[0][2], board[1][1], board[2][0], letter)) return true;

    return false;
  }

  public async execute(input: {
    session: string;
    x: 0 | 1 | 2;
    y: 0 | 1 | 2;
    icon: 'X' | 'O';
  }): Promise<UpdateBoardResponse> {
    const { x, y, icon, session } = input;
    logger.debug('UpdateBoardUsecase::execute', { session, x, y, icon });

    let { board, filledPositions, playerXSocketId, playerOSocketId } = this._cacheService.get<SessionData>(session);

    if (board[x][y] !== '') throw new Error('Position already filled');

    board[x][y] = icon;
    filledPositions++;

    if (this.checkForWin(x, y, icon, board)) {
      logger.info(`UpdateBoardUsecase::execute, player ${icon} won!`, { session });
      logger.info('UpdateBoardUsecase::execute cleaning up stored data for session', { session });
      this._cacheService.delete(session);
      return {
        result: 'win',
        player: icon,
        playerOSocketId,
        playerXSocketId
      };
    }

    if (filledPositions === 9) {
      logger.info('UpdateBoardUsecase::execute, game drawn', { session });
      logger.info('UpdateBoardUsecase::execute cleaning up stored data for session', { session });
      this._cacheService.delete(session);
      return {
        result: 'draw',
        player: icon,
        playerOSocketId,
        playerXSocketId
      };
    }

    this._cacheService.set<SessionData>(session, {
      board,
      filledPositions,
      playerXSocketId,
      playerOSocketId
    });

    return {
      result: 'continue',
      player: icon,
      playerXSocketId,
      playerOSocketId
    };
  }
}