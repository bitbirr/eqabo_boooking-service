import { createPayment, markPaymentSuccess, markPaymentFailed } from '../services/payment.service.js';

// Initiate a payment
export const initiatePayment = async (req, res) => {
  try {
    const { bookingId, provider } = req.body;
    const payment = await createPayment({ bookingId, provider });
    res.status(201).json({
      paymentId: payment.id,
      status: payment.status,
      redirectUrl: `https://${provider}/pay/...`, // Mock URL
    });
  } catch (error) {
    res.status(500).json({ message: 'Error initiating payment', error });
  }
};

// Handle payment callback
export const handlePaymentCallback = async (req, res) => {
  try {
    const { paymentId, status } = req.body;
    if (status === 'success') {
      await markPaymentSuccess(paymentId);
    } else if (status === 'failed') {
      await markPaymentFailed(paymentId);
    } else {
      throw new Error('Invalid payment status');
    }
    res.status(200).json({ message: 'Callback processed' });
  } catch (error) {
    res.status(500).json({ message: 'Error handling payment callback', error });
  }
};