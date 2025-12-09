import request from 'supertest';
import { app } from '../src/server.js';

describe('GET /api/test', () => {
  it('returns a test payload', async () => {
    const res = await request(app).get('/api/test');

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('message', 'Test endpoint OK');
    expect(res.body).toHaveProperty('environment');
  });
});
