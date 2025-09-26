import { Router } from 'express';
import { createNewBooking, fetchBookingDetails, getBookingReceipt } from '../controllers/bookingController.js';

const router = Router();

// POST /api/bookings - Create a new booking
router.post('/', createNewBooking);

// GET /api/bookings/:id - Get booking details
router.get('/:id', fetchBookingDetails);

// GET /api/bookings/:bookingId/receipt - Get receipt
router.get('/:bookingId/receipt', getBookingReceipt);

export default router;