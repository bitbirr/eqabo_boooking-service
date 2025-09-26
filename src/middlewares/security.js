import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';

export const securityMiddlewares = (app) => {
  app.use(cors());
  app.use(helmet());
  app.use(compression());
};