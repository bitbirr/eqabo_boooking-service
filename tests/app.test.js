import request from 'supertest';
import app from '../src/app.js';

describe('GET /api/hotels', () => {
  it('should return a list of hotels', async () => {
    const response = await request(app).get('/api/hotels');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });
});