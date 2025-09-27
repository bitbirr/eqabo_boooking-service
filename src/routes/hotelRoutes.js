import { Router } from 'express';
import { getHotels, getHotelRooms } from '../controllers/hotelController.js';

const router = Router();

/**
 * @swagger
 * /hotels:
 *   get:
 *     summary: List hotels, optionally filtered by city
 *     parameters:
 *       - in: query
 *         name: city_id
 *         schema:
 *           type: integer
 *         description: City ID to filter hotels
 *     responses:
 *       200:
 *         description: A list of hotels
 */
router.get('/', async (req, res) => {
  try {
    await getHotels(req, res);
  } catch (error) {
    console.error('Error in hotels route:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

/**
 * @swagger
 * /hotels/{hotelId}/rooms:
 *   get:
 *     summary: List rooms for a hotel with availability
 *     parameters:
 *       - in: path
 *         name: hotelId
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
router.get('/:hotelId/rooms', async (req, res) => {
  try {
    await getHotelRooms(req, res);
  } catch (error) {
    console.error('Error in hotel rooms route:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

export default router;