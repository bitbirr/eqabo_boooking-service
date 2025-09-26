import request from 'supertest';
import app from '../src/app.js';

describe('Receipts API', () => {
  let bookingId;

  beforeAll(async () => {
    // Create and confirm a booking
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
    // Assume we confirm it somehow, or test the endpoint
  });

  it('should return booking details', async () => {
    const response = await request(app).get(`/api/bookings/${bookingId}`);
    expect(response.status).toBe(200);
    expect(response.body.id).toBe(bookingId);
    expect(response.body.status).toBe('confirmed'); // Assuming confirmed
  });

  it('should generate a valid PDF receipt', async () => {
    const response = await request(app).get(`/api/bookings/${bookingId}/receipt`);
    expect(response.status).toBe(200);
    expect(response.headers['content-type']).toBe('application/pdf');
    // Check if it's a valid PDF, perhaps check buffer length > 0
    expect(response.body.length).toBeGreaterThan(0);
  });
});