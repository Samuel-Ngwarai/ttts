import { CacheService } from '../../../services/cache-service';
import { GameController } from '../../game-controller';

describe(__filename, () => {
  const gameController = new GameController();
  describe('playMove', () => {
    it('should play a move given input', async () => {
      gameController['_updateBoardUsecase'] = {
        execute: jest.fn().mockImplementationOnce(() => {
          return {
            result: 'draw'
          };
        })
      };
      const res = await gameController.playMove({
        x: 0,
        y: 0,
        session: 'sessionId',
        icon: 'X'
      });
      expect(res).toStrictEqual({ result: 'draw' });
      expect(gameController['_updateBoardUsecase'].execute).toBeCalledWith({ icon: 'X', session: 'sessionId', x: 0, y: 0 });
    });
  });

  describe('establishConnection', () => {
    it('should establish connection between two players', () => {
      gameController['_cacheService'] = {
        set: jest.fn(),
        has: jest.fn()
          .mockImplementationOnce(() => false)
          .mockImplementationOnce(() => true),
        get: jest.fn(() => 'socket1'),
        delete: jest.fn()
      } as any as CacheService;
      const res = gameController.establishConnection('socket1');
      expect(res).toStrictEqual({
        result: 'waiting for player B'
      });
      expect(gameController['_cacheService'].has).toBeCalledWith('waitingPlayer');

      const res2 = gameController.establishConnection('socket2');
      expect(res2).toStrictEqual({
        playerOSocketId: 'socket2',
        playerXSocketId: 'socket1',
        result: 'players connected',
        sessionId: expect.any(String),
      });
      expect(gameController['_cacheService'].has).toBeCalledTimes(2);
      expect(gameController['_cacheService'].delete).toBeCalledWith('waitingPlayer');
      expect(gameController['_cacheService'].get).toBeCalledWith('waitingPlayer');
      expect(gameController['_cacheService'].set).toBeCalledWith(expect.any(String),
        {
          board: [['', '', ''], ['', '', ''], ['', '', '']],
          filledPositions: 0,
          playerOSocketId: 'socket2',
          playerXSocketId: 'socket1'
        });
    });
  });

});
