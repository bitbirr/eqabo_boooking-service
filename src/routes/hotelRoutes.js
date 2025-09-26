import { Router } from 'express';
import { getHotels, getHotelRooms } from '../controllers/hotelController.js';

const router = Router();

// GET /api/hotels - List hotels, optionally by city
router.get('/', getHotels);

// GET /api/hotels/:hotelId/rooms - List rooms with availability
router.get('/:hotelId/rooms', getHotelRooms);

export default router;