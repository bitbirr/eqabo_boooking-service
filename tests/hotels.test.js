import request from 'supertest';
import app from '../src/app.js';

describe('Hotels API', () => {
  it('should return hotels for a given city', async () => {
    const response = await request(app).get('/api/hotels?cityId=1'); // Assuming cityId 1 is Addis Ababa
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBe(2); // 2 hotels per city
  });
});