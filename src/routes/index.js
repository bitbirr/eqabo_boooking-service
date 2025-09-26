import { Router } from 'express';
import citiesRoutes from './citiesRoutes.js';
import hotelRoutes from './hotelRoutes.js';
import roomsRoutes from './roomsRoutes.js';
import bookingRoutes from './bookingRoutes.js';
import paymentRoutes from './paymentRoutes.js';
import receiptsRoutes from './receiptsRoutes.js';

const router = Router();

router.use('/cities', citiesRoutes);
router.use('/hotels', hotelRoutes);
router.use('/rooms', roomsRoutes);
router.use('/bookings', bookingRoutes);
router.use('/payments', paymentRoutes);
router.use('/receipts', receiptsRoutes);

export default router;