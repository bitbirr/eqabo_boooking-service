import { Router } from 'express';
import { setupSwagger } from '../config/swagger.js';

const router = Router();

// Setup Swagger documentation
setupSwagger(router);

export default router;