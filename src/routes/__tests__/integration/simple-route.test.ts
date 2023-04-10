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

    describe('/simple', () => {
      it('/should return simple', async () => {

        const res = await request(expressServer).get('/simple');

        expect(res.body).toBe(1);
        expect(res.statusCode).toEqual(200);
      });
    });
  });
});
