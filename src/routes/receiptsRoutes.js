import { Router } from 'express';
import { getBookingReceipt } from '../controllers/bookingController.js';

const router = Router();

/**
 * @swagger
 * /receipts/{booking_id}:
 *   get:
 *     summary: Get booking receipt as PDF
 *     parameters:
 *       - in: path
 *         name: booking_id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: PDF receipt
 *         content:
 *           application/pdf:
 *             schema:
 *               type: string
 *               format: binary
 */
router.get('/:booking_id', getBookingReceipt);

export default router;