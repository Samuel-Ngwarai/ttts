import express, { Express, Request, Response, NextFunction } from 'express';
import bodyparser from 'body-parser';
import { createServer, Server as HttpServer } from 'http';
import { Server as SocketServer } from 'socket.io';
import config from 'config';
import swaggerUi from 'swagger-ui-express';
import swaggerJsDoc from 'swagger-jsdoc';
import cors from 'cors';
import { appContainer } from '../containers/inversify.config';


import { IRoute } from '../routes/routes-i';

import { logger } from '../utils/logger';

export class Server {
    private server: Express;
    private io: SocketServer;
    private httpServer: HttpServer;
    private port: number = config.get('PORT');
    private createSwaggerFile: boolean= config.get('CREATE_SWAGGER_FILE');

    public constructor() {
        this.server = express();
        this.httpServer = createServer(this.server);
        this.io = new SocketServer(this.httpServer, {
            cors: {
                origin: 'http://localhost:3000'
            },
            connectionStateRecovery: {
                // the backup duration of the sessions and the packets
                maxDisconnectionDuration: 2 * 60 * 1000,
                // whether to skip middlewares upon successful recovery
                skipMiddlewares: true,
            }
        });
    }

    public async init(listen: boolean): Promise<Express> {
        try {
            if (listen) {
                // await this.server.listen(this.port);
                this.httpServer.listen(this.port);
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

    public addExtensions() {
        this.server.use(bodyparser.json());
        this.server.use(cors());
    }

    public addRoutes(routes: IRoute): void {
        routes.register(this.server);
    }


    public initializeSocketIo() {
        logger.info('adding sockets connection');
        const gameController = appContainer().gameController;
        this.io.on('connection', (socket) => {
            console.log('socket id ->', socket.id); // ojIckSD2jqNzOqIrAGzL
            socket.join(socket.id);

            if (socket.recovered) {
                // recovery was successful: socket.id, socket.rooms and socket.data were restored
                logger.info('The state was just recovered for socket', { id: socket.id });
            }

            /**
       * Initialize connection to server. The connection should either
       * 1. pick up another player from the queue if there is one and establish a bi-directional connection, OR
       * 2. get into the queue with a 'room number' id generated to then begin the game.
       */
            socket.on('establish-connection', () => {
                logger.info('Establishing connection for ', { socket: socket.id });
                const res = gameController.establishConnection(socket.id);

                if (res === 'waiting for player B') {
                    logger.debug('waiting for player B at socket -> ', { socket: socket.id });
                    this.io.to(socket.id).emit('waiting-for-player-b', 'Please patiently wait for player B');
                    return;
                }

                logger.debug('initiating game for player A and B');
                this.io.to(res.playerA).emit('player-a', { connectionId: res.connectionId });
                this.io.to(res.playerB).emit('player-b', { connectionId: res.connectionId });
            });

            socket.on('connect_error', err => console.log(err));
            socket.on('connect_failed', err => console.log(err));
            socket.on('disconnect', err => console.log(err));

        });
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
