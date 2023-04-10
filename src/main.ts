process.env.NODE_CONFIG_DIR = require('path').resolve(__dirname, 'config');
import { Express } from 'express';

import { Server } from './server';
import { Routes } from './routes';

import { logger } from './utils/logger';
import { initializeAppContainer } from './containers/inversify.config';

export default class App {
  public expressServer: Express;
  private server: Server;

  public constructor(private readonly listen: boolean) {}

  public async init(): Promise<void> {
    this.server = new Server();

    await initializeAppContainer();
    const routes = new Routes();

    this.server.addExtensions();
    this.server.addSwaggerFile();
    this.server.addRoutes(routes);
    this.server.addErrorHandler();

    this.expressServer = await this.server.init(this.listen);

    logger.info('App::init - Application started');
  }
}

if (require.main === module) {
  const app = new App(true);
  app.init();
}
