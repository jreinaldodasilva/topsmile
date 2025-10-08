// backend/tests/integration/errorHandler.test.ts
import request from 'supertest';
import express from 'express';
import { errorHandler } from '../../src/middleware/errorHandler';
import { AppError, NotFoundError, ValidationError } from '../../src/utils/errors/errors';

const createTestApp = () => {
  const app = express();
  
  app.get('/app-error', (req, res, next) => {
    next(new AppError('Test error', 400, 'TEST_ERROR'));
  });
  
  app.get('/not-found', (req, res, next) => {
    next(new NotFoundError('User'));
  });
  
  app.get('/validation-error', (req, res, next) => {
    next(new ValidationError('Invalid input', { field: 'email' }));
  });
  
  app.get('/generic-error', (req, res, next) => {
    next(new Error('Generic error'));
  });
  
  app.use(errorHandler);
  
  return app;
};

describe('Error Handler Middleware', () => {
  const app = createTestApp();

  it('handles AppError correctly', async () => {
    const response = await request(app).get('/app-error');
    
    expect(response.status).toBe(400);
    expect(response.body).toMatchObject({
      success: false,
      error: {
        message: 'Test error',
        code: 'TEST_ERROR',
        statusCode: 400
      }
    });
  });

  it('handles NotFoundError correctly', async () => {
    const response = await request(app).get('/not-found');
    
    expect(response.status).toBe(404);
    expect(response.body.success).toBe(false);
    expect(response.body.error.message).toBe('User não encontrado');
  });

  it('handles ValidationError correctly', async () => {
    const response = await request(app).get('/validation-error');
    
    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
  });

  it('handles generic errors', async () => {
    const response = await request(app).get('/generic-error');
    
    expect(response.status).toBe(500);
    expect(response.body.success).toBe(false);
  });
});
