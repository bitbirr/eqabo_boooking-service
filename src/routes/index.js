import { Router } from 'express';
import citiesRoutes from './citiesRoutes.js';
import hotelRoutes from './hotelRoutes.js';
import bookingRoutes from './bookingRoutes.js';
import paymentRoutes from './paymentRoutes.js';

const router = Router();

router.use('/cities', citiesRoutes);
router.use('/hotels', hotelRoutes);
router.use('/bookings', bookingRoutes);
router.use('/payments', paymentRoutes);

export default router;