import dotenv from 'dotenv';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import pino from 'pino';
import pinoHttp from 'pino-http';
import routes from './routes/index.js';
import { setupSwagger } from './config/swagger.js';
import { errorHandler } from './middlewares/errorHandler.js';
import pinoPretty from 'pino-pretty';

dotenv.config();

const app = express();

// Logging
const logger = pino(process.env.NODE_ENV !== 'production' ? pinoPretty() : {});

// Middleware
logger.info('Setting up middleware...');
app.use(helmet());
app.use(cors({ origin: true, credentials: true }));
app.use(compression());
app.use(express.json({ limit: '1mb' }));

// Routes
logger.info('Setting up routes...');
app.use('/api', routes);
setupSwagger(app);

// Error handling
app.use(errorHandler);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Not Found' });
});

export default app;