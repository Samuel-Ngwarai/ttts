import express, { Express, Request, Response, NextFunction } from 'express';
import bodyparser from 'body-parser';
import config from 'config';
import swaggerUi from 'swagger-ui-express';
import swaggerJsDoc from 'swagger-jsdoc';
import cors from 'cors';

import { IRoute } from '../routes/routes-i';
import { logger } from '../utils/logger';

export class Server {
  private server: Express;
  private port: number = config.get('PORT');
  private createSwaggerFile: boolean= config.get('CREATE_SWAGGER_FILE');

  public constructor() {
    this.server = express();
  }

  public async init(listen: boolean): Promise<Express> {
    try {
      if (listen) {
        await this.server.listen(this.port);
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
