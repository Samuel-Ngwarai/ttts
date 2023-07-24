import express, { Express, Request, Response, NextFunction } from 'express';
import bodyparser from 'body-parser';
import config from 'config';
import swaggerUi from 'swagger-ui-express';
import swaggerJsDoc from 'swagger-jsdoc';
import cors from 'cors';
import { createServer } from 'http';
import { Server as  SocketServer } from 'socket.io';
import { appContainer } from '../containers/inversify.config';

import { IRoute } from '../routes/routes-i';
import { logger } from '../utils/logger';

export class Server {
  private server: Express;
  private port: number = config.get('PORT');
  private createSwaggerFile: boolean= config.get('CREATE_SWAGGER_FILE');
  private io: SocketServer;
  private gameController = appContainer().gameController;

  public constructor() {
    this.server = express();
  }

  public async init(listen: boolean): Promise<Express> {
    try {
      if (listen) {
        const httpServer = createServer(this.server);
        this.io = new SocketServer(httpServer, {
          cors: {
            origin: '*'
          }
        });
        this.addSocketMethods();
        httpServer.listen(this.port);
      }
      logger.info('Server::init - Server running at:', {
        uri: `localhost:${this.port}`,
      });
    } catch (error) {
      logger.error('Server::init - Server failed to start', { error });
      process.exit(1);
    }

    return this.server;
  }

  private addSocketMethods() {
    this.io.on('connection', (socket) => {

      socket.on('establish-connection', () => {
        logger.info('Establishing connection for ', { socket: socket.id });
        const { result, playerXSocketId, playerOSocketId, sessionId } = this.gameController.establishConnection(socket.id);

        if (result === 'waiting for player B') {
          logger.debug('waiting for player B at socket -> ', { socket: socket.id });
          this.io.to(socket.id).emit('waiting-for-player-b', 'Please patiently wait for player B');
          return;
        }

        logger.debug('initiating game for player A and B', { A: playerXSocketId, B: playerOSocketId });
        this.io.to(playerXSocketId).emit('player-a', { sessionId });
        this.io.to(playerOSocketId).emit('player-b', { sessionId });
      });

      socket.on('play', async (args) => {
        logger.info('Server::addSocketMethods, play game with args', { ...args });
        const { x, y, session, icon } = args;

        try {
          const { playerXSocketId, playerOSocketId, player, result } = await this.gameController.playMove({ x, y, session, icon });

          const currPlayerSocketId = player === 'X' ? playerXSocketId : playerOSocketId;
          const waitingPlayerSocketId = player === 'X' ? playerOSocketId : playerXSocketId;

          logger.debug('Server::addSocketMethods,', { player, currPlayerSocketId, waitingPlayerSocketId });
          let currPlayEvent = '', waitingPlayerEvent = '';

          switch (result) {
          case 'continue':
            currPlayEvent = 'waiting-for-other-player';
            waitingPlayerEvent = 'current-turn-to-play';
            break;
          case 'draw':
            currPlayEvent = 'end-draw';
            waitingPlayerEvent = 'end-draw';
            break;
          default:
            currPlayEvent = 'end-win';
            waitingPlayerEvent = 'end-loss';
            break;
          }

          this.io.to(currPlayerSocketId).emit(currPlayEvent, { x, y });
          this.io.to(waitingPlayerSocketId).emit(waitingPlayerEvent, { x, y });
        } catch (error) {
          logger.error('Server::addSocketMethods, Some error happened whilst playing', { error });

          if (error.message === 'Position already filled') {
            logger.error('Server::addSocketMethods, Current position already filled. Asking player to play again');
            this.io.to(socket.id).emit('already-played-repeat');
          }
        }
      });

      socket.on('disconnect', () => {
        logger.error('Server::addSocketMethods, A user has disconnected.', { socker: socket.id });
      });
    });

    this.io.engine.on('connection_error', (err) => {
      logger.error('Server::addSocketMethods, Some connection error happened', { err });
    });
  }

  public addExtensions() {
    this.server.use(bodyparser.json());
    this.server.use(cors());
  }

  public addRoutes(routes: IRoute): void {
    routes.register(this.server);
  }

  public addErrorHandler() {
    this.server.use((err: any, req: Request, res: Response, _: NextFunction) => {
      logger.error(err);

      const errorObject  = {
        message: err.message,
        stack: err.stack,
        statusCode: err.status
      };
      res.status(err.status || 500).send(errorObject);
    });
  }

  public addSwaggerFile() {
    if (this.createSwaggerFile) {
      logger.info('Server::addSwaggerFile, creating swagger file');
      const swaggerDocument = require('../../../swagger.json');
      const swaggerDocs = swaggerJsDoc(swaggerDocument);
      this.server.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
      logger.info(`Server::addSwaggerFile, Swagger file running at 'http://localhost:${this.port}/api-docs'`);
    }
  }
}
