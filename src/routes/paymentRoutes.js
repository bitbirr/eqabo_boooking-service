import { Router } from 'express';
import { initiatePayment, handlePaymentCallback } from '../controllers/paymentController.js';

const router = Router();

/**
 * @swagger
 * /payments/initiate:
 *   post:
 *     summary: Initiate payment
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               bookingId:
 *                 type: string
 *               amount:
 *                 type: number
 *     responses:
 *       200:
 *         description: Payment initiated
 */
router.post('/initiate', initiatePayment);

/**
 * @swagger
 * /payments/callback:
 *   post:
 *     summary: Handle payment callback
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               bookingId:
 *                 type: string
 *               status:
 *                 type: string
 *     responses:
 *       200:
 *         description: Callback handled
 */
router.post('/callback', handlePaymentCallback);

export default router;