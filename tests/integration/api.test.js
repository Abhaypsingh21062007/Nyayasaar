import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import { app } from '../../server/server.js'; // Ensure server.js exports the express app

describe('API Integration Tests', () => {
  it('should return security headers from Helmet', async () => {
    const res = await request(app).get('/api/health');
    expect(res.headers['x-content-type-options']).toBe('nosniff');
    expect(res.headers['x-frame-options']).toBe('SAMEORIGIN');
    expect(res.headers['x-xss-protection']).toBe('0'); // Helmet 4+ sets this to 0 by default
  });

  it('should allow health check', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
  });

  it('should enforce JSON body limit', async () => {
    const hugePayload = { text: 'A'.repeat(3 * 1024 * 1024) }; // 3MB
    const res = await request(app)
      .post('/api/documents/chat')
      .send(hugePayload)
      .set('Content-Type', 'application/json');
    
    // Express returns 413 Payload Too Large when body limit is exceeded
    expect(res.status).toBe(413);
  });
});
