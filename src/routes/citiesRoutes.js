import { Router } from 'express';
import { getCities } from '../controllers/hotelController.js';

const router = Router();

/**
 * @swagger
 * /cities:
 *   get:
 *     summary: List all cities
 *     responses:
 *       200:
 *         description: A list of cities
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: string
 */
router.get('/', getCities);

export default router;