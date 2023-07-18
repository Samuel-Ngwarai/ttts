import { Express } from 'express';
import request from 'supertest';

import App from '../../../main';

describe(__filename, () => {
  let app: App;
  let expressServer: Express;

  beforeAll(async () => {
    app = new App(false);
    await app.init();

    expressServer = app.expressServer;
  });

  describe('GET', () => {

    describe('/healthz', () => {
      it('/should return successful response', async () => {

        const res = await request(expressServer).get('/healthz');

        expect(res.body).toStrictEqual({ healthy: true });
        expect(res.statusCode).toEqual(200);
      });
    });
  });
});
