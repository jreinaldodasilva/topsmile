import request from 'supertest';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';

const app = express();
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

app.get('/test', (req, res) => {
  res.json({ message: 'Security test endpoint' });
});

describe('Security Headers Validation', () => {
  describe('HTTP Security Headers', () => {
    it('should include X-Content-Type-Options header', async () => {
      const response = await request(app).get('/test');
      
      expect(response.headers['x-content-type-options']).toBe('nosniff');
    });

    it('should include X-Frame-Options header', async () => {
      const response = await request(app).get('/test');
      
      expect(response.headers['x-frame-options']).toBe('DENY');
    });

    it('should include X-XSS-Protection header', async () => {
      const response = await request(app).get('/test');
      
      expect(response.headers['x-xss-protection']).toBe('0');
    });

    it('should include Strict-Transport-Security header', async () => {
      const response = await request(app).get('/test');
      
      expect(response.headers['strict-transport-security']).toBeDefined();
    });

    it('should include Content-Security-Policy header', async () => {
      const response = await request(app).get('/test');
      
      expect(response.headers['content-security-policy']).toBeDefined();
    });
  });

  describe('CORS Configuration', () => {
    it('should handle preflight requests', async () => {
      const response = await request(app)
        .options('/test')
        .set('Origin', 'http://localhost:3000')
        .set('Access-Control-Request-Method', 'GET');

      expect(response.headers['access-control-allow-origin']).toBeDefined();
    });

    it('should reject unauthorized origins', async () => {
      const response = await request(app)
        .get('/test')
        .set('Origin', 'http://malicious-site.com');

      expect(response.headers['access-control-allow-origin']).not.toBe('http://malicious-site.com');
    });
  });

  describe('Response Security', () => {
    it('should not expose server information', async () => {
      const response = await request(app).get('/test');
      
      expect(response.headers['server']).toBeUndefined();
      expect(response.headers['x-powered-by']).toBeUndefined();
    });

    it('should set secure content type', async () => {
      const response = await request(app).get('/test');
      
      expect(response.headers['content-type']).toContain('application/json');
    });
  });
});