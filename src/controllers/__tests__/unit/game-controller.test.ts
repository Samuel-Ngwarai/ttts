import { NextFunction, Request, Response } from 'express';
import { GameController } from '../../game-controller';

describe(__filename, () => {
  const gameController = new GameController();
  describe('playMove', () => {
    it('should play a move given input', () => {
      gameController['_updateBoardUsecase'] = {
        execute: jest.fn().mockImplementationOnce(() => {
          return {
            result: 'draw'
          };
        })
      };
      const res = gameController.playMove({
        body: {
          x: 0,
          y: 0,
          player: {
            session: 'sessionId',
            icon: 'X'
          }
        }
      } as Request, {} as Response, {} as NextFunction);
      expect(res).toStrictEqual({ result: 'draw' });
      expect(gameController['_updateBoardUsecase'].execute).toBeCalledWith( { playerIcon: 'X', session: 'sessionId', x: 0, y: 0 });
    });

  });

});
