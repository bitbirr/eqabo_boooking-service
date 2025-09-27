import { Router } from 'express';
import citiesRoutes from './citiesRoutes.js';
import hotelRoutes from './hotelRoutes.js';
import roomsRoutes from './roomsRoutes.js';
import bookingRoutes from './bookingRoutes.js';
import paymentRoutes from './paymentRoutes.js';
import receiptsRoutes from './receiptsRoutes.js';

const router = Router();

router.use('/cities', async (req, res) => {
  try {
    await citiesRoutes(req, res);
  } catch (error) {
    console.error('Error in cities route:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.use('/hotels', async (req, res) => {
  try {
    await hotelRoutes(req, res);
  } catch (error) {
    console.error('Error in hotels route:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.use('/rooms', roomsRoutes);
router.use('/bookings', bookingRoutes);
router.use('/payments', paymentRoutes);
router.use('/receipts', receiptsRoutes);

export default router;