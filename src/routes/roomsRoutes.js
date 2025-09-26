import { Router } from 'express';
import { getRooms } from '../controllers/hotelController.js';

const router = Router();

/**
 * @swagger
 * /rooms:
 *   get:
 *     summary: Check room availability
 *     parameters:
 *       - in: query
 *         name: hotel_id
 *         required: true
 *         schema:
 *           type: integer
 *       - in: query
 *         name: checkin
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: checkout
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *     responses:
 *       200:
 *         description: A list of rooms with availability
 */
router.get('/', getRooms);

export default router;