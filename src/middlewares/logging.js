import pino from 'pino';
import expressPino from 'express-pino-logger';

const logger = pino();
export const loggingMiddleware = expressPino({ logger });