import { appContainer, initializeAppContainer } from '../../../containers/inversify.config';
import { GameController } from '../../game-controller';

describe(__filename, () => {
  let gameController: GameController;
  beforeAll(async () => {
    await initializeAppContainer();

    gameController = appContainer().gameController;
  });

  it('simulates a game between two players', async () => {
    const initRes = gameController.establishConnection('player1Socket');
    const connectedRes = gameController.establishConnection('player2Socket');

    expect(initRes).toStrictEqual({
      result: 'waiting for player B',
    });
    expect(connectedRes).toStrictEqual({
      playerOSocketId: 'player2Socket',
      playerXSocketId: 'player1Socket',
      result: 'players connected',
      sessionId: expect.any(String),
    });

    await gameController.playMove({ x: 0, y: 0, session: connectedRes.sessionId, icon: 'X' });
    await gameController.playMove({ x: 1, y: 0, session: connectedRes.sessionId, icon: 'O' });
    await gameController.playMove({ x: 1, y: 1, session: connectedRes.sessionId, icon: 'X' });
    await gameController.playMove({ x: 0, y: 1, session: connectedRes.sessionId, icon: 'O' });
    const res = await gameController.playMove({ x: 2, y: 2, session: connectedRes.sessionId, icon: 'X' });

    expect(res).toStrictEqual({
      player: 'X',
      result: 'win',
    });
  });

  it('throws an error when the same position is played twice', async () => {
    const initRes = gameController.establishConnection('player1Socket');
    const connectedRes = gameController.establishConnection('player2Socket');

    expect(initRes).toStrictEqual({
      result: 'waiting for player B',
    });
    expect(connectedRes).toStrictEqual({
      playerOSocketId: 'player2Socket',
      playerXSocketId: 'player1Socket',
      result: 'players connected',
      sessionId: expect.any(String),
    });

    await gameController.playMove({ x: 0, y: 0, session: connectedRes.sessionId, icon: 'X' });
    await expect(gameController.playMove({ x: 0, y: 0, session: connectedRes.sessionId, icon: 'O' })).rejects.toThrowError(new Error('Position already filled'));
  });

});