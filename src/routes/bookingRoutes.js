import { Router } from 'express';
import { createNewBooking, fetchBookingDetails } from '../controllers/bookingController.js';

const router = Router();

/**
 * @swagger
 * /bookings:
 *   post:
 *     summary: Create a new booking
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               hotelId:
 *                 type: integer
 *               roomId:
 *                 type: integer
 *               checkinDate:
 *                 type: string
 *                 format: date
 *               checkoutDate:
 *                 type: string
 *                 format: date
 *               userName:
 *                 type: string
 *               userPhone:
 *                 type: string
 *     responses:
 *       201:
 *         description: Booking created
 */
router.post('/', createNewBooking);

/**
 * @swagger
 * /bookings/{id}:
 *   get:
 *     summary: Get booking details
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Booking details
 */
router.get('/:id', fetchBookingDetails);

export default router;