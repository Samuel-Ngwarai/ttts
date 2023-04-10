import { Express } from 'express';

export interface IRoute {
  register: (app: Express) => void;
}
