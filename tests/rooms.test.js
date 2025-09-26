import request from 'supertest';
import app from '../src/app.js';

describe('Rooms API', () => {
  it('should return available rooms for selected dates', async () => {
    const checkIn = '2025-10-05';
    const checkOut = '2025-10-07';
    const response = await request(app).get(`/api/rooms?hotelId=1&checkIn=${checkIn}&checkOut=${checkOut}`);
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    // Should return 2 available rooms, since one is reserved
    expect(response.body.length).toBe(2);
  });

  it('should not return rooms that are already reserved', async () => {
    const checkIn = '2025-10-01';
    const checkOut = '2025-10-03';
    const response = await request(app).get(`/api/rooms?hotelId=1&checkIn=${checkIn}&checkOut=${checkOut}`);
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    // Should return 2 available rooms, not the reserved one
    expect(response.body.length).toBe(2);
  });
});