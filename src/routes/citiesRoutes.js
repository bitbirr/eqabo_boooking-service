import { Router } from 'express';
import { getCities } from '../controllers/hotelController.js';

const router = Router();

// GET /api/cities - List all cities
router.get('/', getCities);

export default router;