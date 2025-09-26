import request from 'supertest';
import app from '../src/app.js';

describe('Cities API', () => {
  it('should return a list of cities', async () => {
    const response = await request(app).get('/api/cities');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body).toContain('Addis Ababa');
    expect(response.body).toContain('Lalibela');
  });
});