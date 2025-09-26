import request from 'supertest';
import app from '../src/app.js';

describe('Payments API', () => {
  let bookingId;

  beforeAll(async () => {
    // Create a booking first
    const bookingData = {
      userName: 'guest',
      userPhone: '1234567890',
      hotelId: 1,
      roomId: 2,
      checkinDate: '2025-10-05',
      checkoutDate: '2025-10-07',
    };
    const response = await request(app)
      .post('/api/bookings')
      .send(bookingData);
    bookingId = response.body.id;
  });

  it('should initiate payment', async () => {
    const paymentData = {
      bookingId,
      provider: 'telebirr',
      amount: 16000,
    };
    const response = await request(app)
      .post('/api/payments/initiate')
      .send(paymentData);
    expect(response.status).toBe(200);
    expect(response.body.status).toBe('pending');
  });

  it('should handle payment callback success', async () => {
    const callbackData = {
      referenceId: 'ref123',
      status: 'success',
    };
    const response = await request(app)
      .post('/api/payments/callback')
      .send(callbackData);
    expect(response.status).toBe(200);
    // Check that payment and booking statuses are updated
  });

  it('should handle payment callback failure', async () => {
    const callbackData = {
      referenceId: 'ref124',
      status: 'failed',
    };
    const response = await request(app)
      .post('/api/payments/callback')
      .send(callbackData);
    expect(response.status).toBe(200);
    // Check statuses
  });

  it('should cancel booking on payment amount mismatch', async () => {
    const paymentData = {
      bookingId,
      provider: 'telebirr',
      amount: 15000, // Mismatch
    };
    const response = await request(app)
      .post('/api/payments/initiate')
      .send(paymentData);
    expect(response.status).toBe(400);
  });

  it('should ignore duplicate callback reference', async () => {
    const callbackData = {
      referenceId: 'ref123', // Duplicate
      status: 'success',
    };
    const response = await request(app)
      .post('/api/payments/callback')
      .send(callbackData);
    expect(response.status).toBe(200); // Ignored
  });
});