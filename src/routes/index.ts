import { Express, Request, Response } from 'express';
import { SomeController } from '../controllers/some-controller';
import { appContainer } from '../containers/inversify.config';

import { IRoute } from './routes-i';

export class Routes implements IRoute {
  constructor() {}

  public register(app: Express, _?: SomeController): void {
    const someController = appContainer().someController;

    app.get('/', async (_: Request, res: Response) => {
      res.status(404).send('Unknown route called. Try "/simple" for example');
    });

    app.get('/readyz', async (_: Request, res: Response) => {
      res.json({ ready: true });
    });

    app.get('/healthz', async (_: Request, res: Response) => {
      res.json({ healthy: true });
    });

    /**
     * @swagger
     *
     * /simple:
     *   get:
     *     description: Do something simple
     *     produces:
     *       - application/json
     *     responses:
     *       200:
     *         description: Successfull Response
     */
    app.get('/simple', someController.doSomethingSimple.bind(someController));

    app.get('*',function (_: Request, res: Response) {
      res.status(404).send('Uknown route called. Try "/simple" for example');
    });
  }
}
