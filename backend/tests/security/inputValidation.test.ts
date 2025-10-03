import request from 'supertest';
import express from 'express';
import { body, validationResult } from 'express-validator';

const app = express();
app.use(express.json());

const validateInput = [
  body('email').isEmail().normalizeEmail(),
  body('name').trim().isLength({ min: 2, max: 50 }).escape(),
  body('phone').matches(/^\(\d{2}\)\s\d{4,5}-\d{4}$/)
];

app.post('/validate', validateInput, (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  res.json({ message: 'Valid input' });
});

describe('Input Validation Security', () => {
  describe('XSS Prevention', () => {
    it('should sanitize HTML in name field', async () => {
      const response = await request(app)
        .post('/validate')
        .send({
          email: 'test@example.com',
          name: '<script>alert("xss")</script>',
          phone: '(11) 99999-9999'
        })
        .expect(400);

      expect(response.body.errors).toBeDefined();
    });

    it('should accept clean input', async () => {
      const response = await request(app)
        .post('/validate')
        .send({
          email: 'test@example.com',
          name: 'João Silva',
          phone: '(11) 99999-9999'
        })
        .expect(200);

      expect(response.body.message).toBe('Valid input');
    });
  });

  describe('Email Validation', () => {
    it('should reject invalid email formats', async () => {
      const response = await request(app)
        .post('/validate')
        .send({
          email: 'invalid-email',
          name: 'Test User',
          phone: '(11) 99999-9999'
        })
        .expect(400);

      expect(response.body.errors).toBeDefined();
    });

    it('should normalize valid emails', async () => {
      const response = await request(app)
        .post('/validate')
        .send({
          email: 'Test@Example.COM',
          name: 'Test User',
          phone: '(11) 99999-9999'
        })
        .expect(200);

      expect(response.body.message).toBe('Valid input');
    });
  });

  describe('Phone Validation', () => {
    it('should reject invalid phone formats', async () => {
      const response = await request(app)
        .post('/validate')
        .send({
          email: 'test@example.com',
          name: 'Test User',
          phone: '123456789'
        })
        .expect(400);

      expect(response.body.errors).toBeDefined();
    });

    it('should accept valid Brazilian phone format', async () => {
      const response = await request(app)
        .post('/validate')
        .send({
          email: 'test@example.com',
          name: 'Test User',
          phone: '(11) 99999-9999'
        })
        .expect(200);

      expect(response.body.message).toBe('Valid input');
    });
  });
});