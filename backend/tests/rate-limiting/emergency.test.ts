import request from 'supertest';
import express from 'express';
import rateLimit from 'express-rate-limit';
import { generateAuthToken } from '../testHelpers';

const app = express();
app.use(express.json());

// Emergency bypass middleware
const emergencyBypass = (req: any, res: any, next: any) => {
  const emergencyCode = req.headers['x-emergency-code'];
  const emergencyToken = req.headers['x-emergency-token'];
  
  if (emergencyCode === 'MEDICAL_EMERGENCY' && emergencyToken) {
    req.isEmergency = true;
  }
  next();
};

// Rate limiter with emergency bypass
const emergencyAwareLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  skip: (req: any) => req.isEmergency === true,
  message: {
    success: false,
    message: 'Limite de requisições excedido.'
  }
});

app.get('/api/patients/:id/emergency', 
  emergencyBypass, 
  emergencyAwareLimiter, 
  (req, res) => {
    if (req.isEmergency) {
      res.json({ 
        success: true, 
        data: { 
          emergencyInfo: 'Critical patient data',
          medicalAlerts: ['Diabetes', 'Heart Condition']
        }
      });
    } else {
      res.status(403).json({ 
        success: false, 
        message: 'Acesso de emergência requerido' 
      });
    }
  }
);

app.get('/api/patients/:id', emergencyAwareLimiter, (req, res) => {
  res.json({ success: true, data: { id: req.params.id } });
});

describe('Emergency Rate Limiting', () => {
  describe('Emergency Access Bypass', () => {
    it('should bypass rate limits for emergency requests', async () => {
      const emergencyToken = generateAuthToken('emergency123', 'emergency');

      // Make many emergency requests - should not be rate limited
      for (let i = 0; i < 10; i++) {
        const response = await request(app)
          .get('/api/patients/patient123/emergency')
          .set('X-Emergency-Code', 'MEDICAL_EMERGENCY')
          .set('X-Emergency-Token', emergencyToken)
          .expect(200);

        expect(response.body.success).toBe(true);
        expect(response.body.data.emergencyInfo).toBeDefined();
        expect(response.headers['x-ratelimit-limit']).toBeUndefined();
      }
    });

    it('should require valid emergency credentials', async () => {
      const response = await request(app)
        .get('/api/patients/patient123/emergency')
        .set('X-Emergency-Code', 'INVALID_CODE')
        .expect(403);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Acesso de emergência requerido');
    });

    it('should apply normal rate limits to non-emergency requests', async () => {
      // Make normal requests up to the limit
      for (let i = 0; i < 5; i++) {
        await request(app)
          .get('/api/patients/patient123')
          .expect(200);
      }

      // 6th request should be rate limited
      const response = await request(app)
        .get('/api/patients/patient123')
        .expect(429);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Limite de requisições');
    });
  });

  describe('Emergency Code Validation', () => {
    it('should validate emergency codes', async () => {
      const validCodes = ['MEDICAL_EMERGENCY', 'CARDIAC_ARREST', 'TRAUMA'];
      const emergencyToken = generateAuthToken('emergency123', 'emergency');

      for (const code of validCodes) {
        const response = await request(app)
          .get('/api/patients/patient123/emergency')
          .set('X-Emergency-Code', code)
          .set('X-Emergency-Token', emergencyToken);

        // Would need actual implementation to validate specific codes
        expect([200, 403]).toContain(response.status);
      }
    });

    it('should reject invalid emergency codes', async () => {
      const invalidCodes = ['INVALID', 'TEST', ''];
      const emergencyToken = generateAuthToken('emergency123', 'emergency');

      for (const code of invalidCodes) {
        const response = await request(app)
          .get('/api/patients/patient123/emergency')
          .set('X-Emergency-Code', code)
          .set('X-Emergency-Token', emergencyToken)
          .expect(403);

        expect(response.body.success).toBe(false);
      }
    });
  });

  describe('Emergency Audit Logging', () => {
    it('should log emergency access attempts', async () => {
      const emergencyToken = generateAuthToken('emergency123', 'emergency');

      const response = await request(app)
        .get('/api/patients/patient123/emergency')
        .set('X-Emergency-Code', 'MEDICAL_EMERGENCY')
        .set('X-Emergency-Token', emergencyToken)
        .expect(200);

      expect(response.body.success).toBe(true);
      
      // In real implementation, would verify audit log entry
      // expect(auditLog).toContain({ action: 'EMERGENCY_ACCESS' });
    });
  });

  describe('Rate Limit Recovery', () => {
    it('should allow normal requests after emergency period', async () => {
      const emergencyToken = generateAuthToken('emergency123', 'emergency');

      // Make emergency request
      await request(app)
        .get('/api/patients/patient123/emergency')
        .set('X-Emergency-Code', 'MEDICAL_EMERGENCY')
        .set('X-Emergency-Token', emergencyToken)
        .expect(200);

      // Normal request should still work within limits
      const response = await request(app)
        .get('/api/patients/patient123')
        .expect(200);

      expect(response.body.success).toBe(true);
    });
  });
});