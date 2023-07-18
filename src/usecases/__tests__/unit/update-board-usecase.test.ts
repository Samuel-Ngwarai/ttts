import { UpdateBoardUsecase } from '../../update-board-usecase';
import { CacheService } from '../../../services/cache-service';

describe(__filename, () => {
  const updateBoardUsecase = new UpdateBoardUsecase();
  describe('allEqual', () => {
    it('returns true if all values given are of the same value', () => {
      const res = updateBoardUsecase['allEqual']('X', 'X', 'X', 'X');
      expect(res).toBe(true);
    });

    it('returns false if NOT all values given are of the same value', () => {
      const res = updateBoardUsecase['allEqual']('X', 'O', 'O', 'X');
      expect(res).toBe(false);
    });
  });

  describe('checkForWin', () => {
    test.each`
      x    | y    | letter | board                                              | result
      ${0} | ${0} | ${'X'} | ${[['X', 'X', 'X'], ['', 'O', ''], ['', 'O', '']]} | ${true}
      ${0} | ${0} | ${'X'} | ${[['X', 'O', ''], ['', 'X', ''], ['', 'O', 'X']]} | ${true}
      ${1} | ${1} | ${'X'} | ${[['O', '', 'X'], ['O', 'X', ''], ['X', '', '']]} | ${true}
      ${0} | ${0} | ${'X'} | ${[['X', 'O', ''], ['X', '', ''], ['X', 'O', '']]} | ${true}
      ${0} | ${0} | ${'X'} | ${[['X', 'O', 'X'], ['', 'O', ''], ['', 'X', '']]} | ${false}
      ${1} | ${0} | ${'X'} | ${[['X', 'O', 'X'], ['', 'O', ''], ['', 'X', '']]} | ${false}
    `(
      'should return $result given last played position',
      async ({ x, y, letter, board, result }) => {
        const res = updateBoardUsecase['checkForWin'](x, y, letter, board);

        expect(res).toBe(result);
      }
    );
  });

  describe('execute', () => {

    beforeEach(() => {
      updateBoardUsecase['_cacheService'] = {
        get: jest.fn().mockImplementationOnce(() => {
          return {
            board: [
              ['', '', ''],
              ['', '', ''],
              ['', '', ''],
            ],
            filledPositions: 0
          };
        }),
        set: jest.fn(),
        delete: jest.fn(),
        has: jest.fn(() => true)
      } as any as CacheService;
    });

    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should update board correctly', async() => {
      updateBoardUsecase['_cacheService'].get = jest.fn().mockImplementationOnce(() => {
        return {
          board: [
            ['', '', ''],
            ['', 'X', ''],
            ['', '', ''],
          ],
          filledPositions: 1
        };
      });

      const res = await updateBoardUsecase.execute({
        session: 'someSessionId',
        x: 0,
        y: 0,
        icon: 'O'
      });

      expect(res).toStrictEqual({
        result: 'continue'
      });
      expect(updateBoardUsecase['_cacheService'].set).toBeCalledWith( 'someSessionId', { 'board': [['O', '', ''], ['', 'X', ''], ['', '', '']], 'filledPositions': 2 });
    });

    it('should create new board if it is the first move', async() => {
      updateBoardUsecase['_cacheService'].has = jest.fn().mockImplementationOnce(() => false);

      const res = await updateBoardUsecase.execute({
        session: 'someSessionId',
        x: 0,
        y: 0,
        icon: 'X'
      });

      expect(res).toStrictEqual({
        result: 'continue'
      });
      expect(updateBoardUsecase['_cacheService'].get).not.toBeCalled();
      expect(updateBoardUsecase['_cacheService'].set).toBeCalledWith( 'someSessionId', { 'board': [['X', '', ''], ['', '', ''], ['', '', '']], 'filledPositions': 1 });
    });

    it('should return expected result in case of a win', async() => {
      updateBoardUsecase['_cacheService'].get = jest.fn().mockImplementationOnce(() => {
        return {
          board: [
            ['', 'O', 'O'],
            ['X', 'X', 'O'],
            ['', '', 'X'],
          ],
          filledPositions: 6
        };
      });

      const res = await updateBoardUsecase.execute({
        session: 'someSessionId',
        x: 0,
        y: 0,
        icon: 'X'
      });

      expect(res).toStrictEqual({
        result: 'win',
        player: 'X'
      });
      expect(updateBoardUsecase['_cacheService'].set).not.toBeCalled();
      expect(updateBoardUsecase['_cacheService'].delete).toBeCalledWith('someSessionId');
    });

    it('should return expected result in case of a draw', async() => {
      updateBoardUsecase['_cacheService'].get = jest.fn().mockImplementationOnce(() => {
        return {
          board: [
            ['', 'O', 'X'],
            ['X', 'O', 'O'],
            ['O', 'X', 'X'],
          ],
          filledPositions: 8
        };
      });

      const res = await updateBoardUsecase.execute({
        session: 'someSessionId',
        x: 0,
        y: 0,
        icon: 'X'
      });

      expect(res).toStrictEqual({
        result: 'draw'
      });
      expect(updateBoardUsecase['_cacheService'].set).not.toBeCalled();
      expect(updateBoardUsecase['_cacheService'].delete).toBeCalledWith('someSessionId');
    });

    it('should return an error if given position is already filled', async() => {
      updateBoardUsecase['_cacheService'].get = jest.fn().mockImplementationOnce(() => {
        return {
          board: [
            ['', 'O', 'X'],
            ['X', 'O', 'O'],
            ['O', 'X', 'X'],
          ],
          filledPositions: 8
        };
      });

      await expect(updateBoardUsecase.execute({
        session: 'someSessionId',
        x: 1,
        y: 1,
        icon: 'X'
      })).rejects.toThrowError(new Error('Position already filled'));
    });
  });
});
