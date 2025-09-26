import { Router } from 'express';
import { initiatePayment, handlePaymentCallback } from '../controllers/paymentController.js';

const router = Router();

// POST /api/payments - Initiate payment
router.post('/', initiatePayment);

// POST /api/payments/callback - Handle callback
router.post('/callback', handlePaymentCallback);

export default router;