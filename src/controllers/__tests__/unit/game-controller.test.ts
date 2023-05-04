import { GameController } from '../../game-controller';


describe(__filename, () => {
    const gameController = new GameController();
    const key = 'someRandomKey';
    const data = 'someRandom Data';

    beforeAll(() => {
        gameController['cacheService'] = {
            get: jest.fn(),
            set: jest.fn(),
            delete: jest.fn(),
            isEmpty: jest.fn(),
            getAndDelete: jest.fn(),
        };
    });

    describe('establishConnection', () => {
        it('should store clientID in redis cache', () => {
            gameController['cacheService'].isEmpty = jest.fn().mockReturnValueOnce(true);
            const clientName = 'testClient';

            const res = gameController.establishConnection(clientName);
            expect(res).toBe('waiting for player B');
            expect(gameController['cacheService'].set).toBeCalledWith(clientName, clientName);
        });

        it('should connect client with already waiting client', () => {
            gameController['cacheService'].isEmpty = jest.fn().mockReturnValueOnce(false);
            gameController['cacheService'].getAndDelete = jest.fn().mockReturnValueOnce('someclient');

            const res = gameController.establishConnection('clientName');

            expect(res).toStrictEqual({
                connectionId: expect.any(String),
                playerA: 'someclient',
                playerB: 'clientName'
            });
        });
    });

});
