import request from 'supertest';
import app  from '../../src/app';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

describe('Security Edge Cases', () => {
  let mongoServer: MongoMemoryServer;
  let validToken: string;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri());
    
    // Create valid token for testing
    validToken = jwt.sign(
      { userId: 'user123', role: 'admin' },
      process.env.JWT_SECRET || 'test-secret',
      { expiresIn: '1h' }
    );
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  describe('JWT Token Manipulation', () => {
    it('should reject tokens with modified payload', async () => {
      // Create token with elevated privileges
      const maliciousPayload = { userId: 'user123', role: 'super_admin' };
      const maliciousToken = jwt.sign(
        maliciousPayload,
        'wrong-secret' // Different secret
      );

      const response = await request(app)
        .get('/api/admin/users')
        .set('Authorization', `Bearer ${maliciousToken}`);

      expect(response.status).toBe(401);
      expect(response.body.error).toContain('Invalid token');
    });

    it('should reject tokens with no signature', async () => {
      const headerPayload = Buffer.from(JSON.stringify({ alg: 'none' })).toString('base64') +
        '.' + Buffer.from(JSON.stringify({ userId: 'user123', role: 'admin' })).toString('base64');
      
      const response = await request(app)
        .get('/api/patients')
        .set('Authorization', `Bearer ${headerPayload}.`);

      expect(response.status).toBe(401);
    });

    it('should reject expired tokens', async () => {
      const expiredToken = jwt.sign(
        { userId: 'user123', role: 'admin' },
        process.env.JWT_SECRET || 'test-secret',
        { expiresIn: '-1h' } // Expired 1 hour ago
      );

      const response = await request(app)
        .get('/api/patients')
        .set('Authorization', `Bearer ${expiredToken}`);

      expect(response.status).toBe(401);
      expect(response.body.error).toContain('expired');
    });

    it('should reject tokens with future iat claim', async () => {
      const futureToken = jwt.sign(
        { 
          userId: 'user123', 
          role: 'admin',
          iat: Math.floor(Date.now() / 1000) + 3600 // 1 hour in future
        },
        process.env.JWT_SECRET || 'test-secret'
      );

      const response = await request(app)
        .get('/api/patients')
        .set('Authorization', `Bearer ${futureToken}`);

      expect(response.status).toBe(401);
    });
  });

  describe('Authorization Bypass Attempts', () => {
    it('should prevent role escalation through parameter pollution', async () => {
      const response = await request(app)
        .post('/api/patients')
        .set('Authorization', `Bearer ${validToken}`)
        .send({
          firstName: 'Test',
          lastName: 'User',
          email: 'test@example.com',
          role: 'admin', // Attempting to set admin role
          isAdmin: true,
          permissions: ['all']
        });

      expect(response.status).toBe(201);
      // Should ignore unauthorized fields
      expect(response.body.patient).not.toHaveProperty('role');
      expect(response.body.patient).not.toHaveProperty('isAdmin');
    });

    it('should prevent access to other clinic data', async () => {
      // Token for clinic1
      const clinic1Token = jwt.sign(
        { userId: 'user123', role: 'admin', clinicId: 'clinic1' },
        process.env.JWT_SECRET || 'test-secret'
      );

      // Try to access clinic2 data
      const response = await request(app)
        .get('/api/patients?clinicId=clinic2')
        .set('Authorization', `Bearer ${clinic1Token}`);

      expect(response.status).toBe(403);
      expect(response.body.error).toContain('access denied');
    });

    it('should prevent SQL injection in clinic isolation', async () => {
      const maliciousClinicId = "'; DROP TABLE patients; --";
      
      const response = await request(app)
        .get(`/api/patients?clinicId=${encodeURIComponent(maliciousClinicId)}`)
        .set('Authorization', `Bearer ${validToken}`);

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('Invalid clinic ID');
    });
  });

  describe('Input Sanitization', () => {
    it('should prevent XSS in patient data', async () => {
      const xssPayload = '<script>alert("xss")</script>';
      
      const response = await request(app)
        .post('/api/patients')
        .set('Authorization', `Bearer ${validToken}`)
        .send({
          firstName: xssPayload,
          lastName: 'Test',
          email: 'test@example.com',
          notes: '<img src=x onerror=alert(1)>'
        });

      expect(response.status).toBe(201);
      // Should sanitize HTML
      expect(response.body.patient.firstName).not.toContain('<script>');
      expect(response.body.patient.notes).not.toContain('onerror');
    });

    it('should prevent NoSQL injection in search queries', async () => {
      const injectionAttempts = [
        '{"$ne": null}',
        '{"$gt": ""}',
        '{"$where": "this.password"}',
        '{"$regex": ".*"}',
        '{"$expr": {"$gt": [{"$strLenCP": "$password"}, 0]}}'
      ];

      for (const injection of injectionAttempts) {
        const response = await request(app)
          .get(`/api/patients/search?q=${encodeURIComponent(injection)}`)
          .set('Authorization', `Bearer ${validToken}`);

        expect(response.status).toBe(400);
        expect(response.body.error).toContain('Invalid search query');
      }
    });

    it('should handle prototype pollution attempts', async () => {
      const pollutionPayload = {
        firstName: 'Test',
        lastName: 'User',
        email: 'test@example.com',
        '__proto__': { isAdmin: true },
        'constructor': { prototype: { isAdmin: true } }
      };

      const response = await request(app)
        .post('/api/patients')
        .set('Authorization', `Bearer ${validToken}`)
        .send(pollutionPayload);

      expect(response.status).toBe(201);
      // Should not pollute prototype
      expect({}.hasOwnProperty('isAdmin')).toBe(false);
    });
  });

  describe('Rate Limiting Security', () => {
    it('should prevent brute force login attempts', async () => {
      const attempts = Array.from({ length: 10 }, () =>
        request(app)
          .post('/api/auth/login')
          .send({
            email: 'admin@test.com',
            password: 'WrongPassword!'
          })
      );

      const responses = await Promise.all(attempts);
      
      // Later attempts should be rate limited
      const rateLimited = responses.filter(r => r.status === 429);
      expect(rateLimited.length).toBeGreaterThan(0);
    });

    it('should implement progressive delays for failed attempts', async () => {
      const email = 'test@example.com';
      
      // First few attempts
      const firstAttempt = await request(app)
        .post('/api/auth/login')
        .send({ email, password: 'wrong1' });
      
      const secondAttempt = await request(app)
        .post('/api/auth/login')
        .send({ email, password: 'wrong2' });

      expect(firstAttempt.status).toBe(401);
      expect(secondAttempt.status).toBe(401);
      
      // Should have rate limiting headers
      expect(secondAttempt.headers['x-ratelimit-remaining']).toBeDefined();
    });
  });

  describe('Session Security', () => {
    it('should invalidate tokens after password change', async () => {
      // This would require implementing token blacklisting
      const response = await request(app)
        .put('/api/auth/change-password')
        .set('Authorization', `Bearer ${validToken}`)
        .send({
          currentPassword: 'oldpassword',
          newPassword: 'newpassword123'
        });

      expect(response.status).toBe(200);
      
      // Old token should be invalidated
      const protectedResponse = await request(app)
        .get('/api/patients')
        .set('Authorization', `Bearer ${validToken}`);

      expect(protectedResponse.status).toBe(401);
    });

    it('should prevent concurrent sessions with same credentials', async () => {
      // Login from first "device"
      const login1 = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'admin@test.com',
          password: 'password123'
        });

      // Login from second "device"
      const login2 = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'admin@test.com',
          password: 'password123'
        });

      expect(login1.status).toBe(200);
      expect(login2.status).toBe(200);

      // First session should be invalidated
      const response1 = await request(app)
        .get('/api/patients')
        .set('Authorization', `Bearer ${login1.body.token}`);

      expect(response1.status).toBe(401);
    });
  });

  describe('Data Exposure Prevention', () => {
    it('should not expose sensitive data in error messages', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'nonexistent@test.com',
          password: 'password123'
        });

      expect(response.status).toBe(401);
      expect(response.body.error).toBe('Invalid credentials');
      // Should not reveal whether email exists or password is wrong
      expect(response.body.error).not.toContain('email');
      expect(response.body.error).not.toContain('password');
      expect(response.body.error).not.toContain('user not found');
    });

    it('should not expose stack traces in production', async () => {
      // Force an error
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'production';

      const response = await request(app)
        .get('/api/patients/invalid-id-format');

      expect(response.status).toBe(400);
      expect(response.body).not.toHaveProperty('stack');
      expect(response.body).not.toHaveProperty('trace');

      process.env.NODE_ENV = originalEnv;
    });

    it('should sanitize database error messages', async () => {
      // Try to create patient with duplicate email
      await request(app)
        .post('/api/patients')
        .set('Authorization', `Bearer ${validToken}`)
        .send({
          firstName: 'First',
          lastName: 'User',
          email: 'duplicate@test.com'
        });

      const response = await request(app)
        .post('/api/patients')
        .set('Authorization', `Bearer ${validToken}`)
        .send({
          firstName: 'Second',
          lastName: 'User',
          email: 'duplicate@test.com'
        });

      expect(response.status).toBe(409);
      expect(response.body.error).toBe('Email already exists');
      // Should not expose database internals
      expect(response.body.error).not.toContain('E11000');
      expect(response.body.error).not.toContain('duplicate key');
    });
  });

  describe('File Upload Security', () => {
    it('should reject malicious file types', async () => {
      const response = await request(app)
        .post('/api/patients/avatar')
        .set('Authorization', `Bearer ${validToken}`)
        .attach('file', Buffer.from('<?php echo "hack"; ?>'), {
          filename: 'malicious.php',
          contentType: 'application/x-php'
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('Invalid file type');
    });

    it('should enforce file size limits', async () => {
      const largeFile = Buffer.alloc(10 * 1024 * 1024); // 10MB
      
      const response = await request(app)
        .post('/api/patients/avatar')
        .set('Authorization', `Bearer ${validToken}`)
        .attach('file', largeFile, {
          filename: 'large.jpg',
          contentType: 'image/jpeg'
        });

      expect(response.status).toBe(413);
      expect(response.body.error).toContain('File too large');
    });
  });

  describe('CSRF Protection', () => {
    it('should require CSRF token for state-changing operations', async () => {
      const response = await request(app)
        .post('/api/patients')
        .set('Authorization', `Bearer ${validToken}`)
        .set('Origin', 'https://malicious-site.com')
        .send({
          firstName: 'Test',
          lastName: 'User',
          email: 'test@example.com'
        });

      expect(response.status).toBe(403);
      expect(response.body.error).toContain('CSRF');
    });

    it('should validate Origin header', async () => {
      const response = await request(app)
        .post('/api/patients')
        .set('Authorization', `Bearer ${validToken}`)
        .set('Origin', 'https://evil.com')
        .send({
          firstName: 'Test',
          lastName: 'User',
          email: 'test@example.com'
        });

      expect(response.status).toBe(403);
      expect(response.body.error).toContain('Invalid origin');
    });
  });
});