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
router.get('/', async (req, res) => {
  try {
    await getCities(req, res);
  } catch (error) {
    console.error('Error in cities route:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

export default router;