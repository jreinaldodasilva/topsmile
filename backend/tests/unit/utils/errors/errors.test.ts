// backend/tests/unit/errors.test.ts
import {
  AppError,
  ValidationError,
  NotFoundError,
  UnauthorizedError,
  ForbiddenError,
  ConflictError,
  BadRequestError
} from '../../src/utils/errors/errors';

describe('Error Classes', () => {
  describe('AppError', () => {
    it('creates error with message and status code', () => {
      const error = new AppError('Test error', 500);
      expect(error.message).toBe('Test error');
      expect(error.statusCode).toBe(500);
      expect(error.isOperational).toBe(true);
    });

    it('serializes to JSON', () => {
      const error = new AppError('Test error', 400, 'TEST_CODE');
      const json = error.toJSON();
      
      expect(json).toEqual({
        success: false,
        error: {
          message: 'Test error',
          code: 'TEST_CODE',
          statusCode: 400,
          details: undefined,
          timestamp: expect.any(String)
        }
      });
    });
  });

  describe('ValidationError', () => {
    it('creates validation error with 400 status', () => {
      const error = new ValidationError('Invalid input', { field: 'email' });
      expect(error.statusCode).toBe(400);
      expect(error.code).toBe('VALIDATION_ERROR');
      expect(error.details).toEqual({ field: 'email' });
    });
  });

  describe('NotFoundError', () => {
    it('creates not found error with 404 status', () => {
      const error = new NotFoundError('User');
      expect(error.message).toBe('User não encontrado');
      expect(error.statusCode).toBe(404);
      expect(error.code).toBe('NOT_FOUND');
    });
  });

  describe('UnauthorizedError', () => {
    it('creates unauthorized error with 401 status', () => {
      const error = new UnauthorizedError();
      expect(error.statusCode).toBe(401);
      expect(error.code).toBe('UNAUTHORIZED');
    });
  });

  describe('ForbiddenError', () => {
    it('creates forbidden error with 403 status', () => {
      const error = new ForbiddenError();
      expect(error.statusCode).toBe(403);
      expect(error.code).toBe('FORBIDDEN');
    });
  });

  describe('ConflictError', () => {
    it('creates conflict error with 409 status', () => {
      const error = new ConflictError('Email already exists');
      expect(error.statusCode).toBe(409);
      expect(error.code).toBe('CONFLICT');
    });
  });

  describe('BadRequestError', () => {
    it('creates bad request error with 400 status', () => {
      const error = new BadRequestError('Missing field');
      expect(error.statusCode).toBe(400);
      expect(error.code).toBe('BAD_REQUEST');
    });
  });
});
