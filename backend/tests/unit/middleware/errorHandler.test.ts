import { Request, Response, NextFunction } from 'express';
import { errorHandler } from '../../../src/middleware/errorHandler';
import { 
  AppError, 
  ValidationError, 
  UnauthorizedError, 
  NotFoundError, 
  ConflictError 
} from '../../../src/types/errors';

describe('Error Handler Middleware', () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let mockNext: NextFunction;
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    mockReq = {
      path: '/api/test',
      method: 'POST',
      ip: '127.0.0.1',
      get: jest.fn().mockReturnValue('Mozilla/5.0')
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    mockNext = jest.fn();
    
    // Spy on console.error to verify logging
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  describe('AppError handling', () => {
    it('should handle ValidationError with 400 status', () => {
      const error = new ValidationError('Email is required');

      errorHandler(error, mockReq as Request, mockRes as Response, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'Email is required',
        errors: [{ msg: 'Email is required', param: 'general' }],
        meta: {
          timestamp: expect.any(String),
          requestId: undefined
        }
      });
    });

    it('should handle UnauthorizedError with 401 status', () => {
      const error = new UnauthorizedError('Invalid credentials');

      errorHandler(error, mockReq as Request, mockRes as Response, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'Invalid credentials',
        errors: [{ msg: 'Invalid credentials', param: 'general' }],
        meta: {
          timestamp: expect.any(String),
          requestId: undefined
        }
      });
    });

    it('should handle NotFoundError with 404 status', () => {
      const error = new NotFoundError('User not found');

      errorHandler(error, mockReq as Request, mockRes as Response, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'User not found',
        errors: [{ msg: 'User not found', param: 'general' }],
        meta: {
          timestamp: expect.any(String),
          requestId: undefined
        }
      });
    });

    it('should handle ConflictError with 409 status', () => {
      const error = new ConflictError('Email already exists');

      errorHandler(error, mockReq as Request, mockRes as Response, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(409);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'Email already exists',
        errors: [{ msg: 'Email already exists', param: 'general' }],
        meta: {
          timestamp: expect.any(String),
          requestId: undefined
        }
      });
    });

    it('should handle custom AppError with custom status code', () => {
      const error = new AppError('Custom error message', 418);

      errorHandler(error, mockReq as Request, mockRes as Response, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(418);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'Custom error message',
        errors: [{ msg: 'Custom error message', param: 'general' }],
        meta: {
          timestamp: expect.any(String),
          requestId: undefined
        }
      });
    });
  });

  describe('Unknown error handling', () => {
    it('should handle generic Error with 500 status', () => {
      const error = new Error('Database connection failed');

      errorHandler(error, mockReq as Request, mockRes as Response, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'Erro interno do servidor',
        errors: [{ msg: 'Database connection failed', param: 'general' }],
        meta: {
          timestamp: expect.any(String),
          requestId: undefined
        }
      });
    });

    it('should handle errors with array of errors', () => {
      const error = new Error('Multiple validation errors') as any;
      error.errors = [
        { msg: 'Email is required', param: 'email' },
        { msg: 'Password is required', param: 'password' }
      ];

      errorHandler(error, mockReq as Request, mockRes as Response, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'Erro interno do servidor',
        errors: [
          { msg: 'Email is required', param: 'email' },
          { msg: 'Password is required', param: 'password' }
        ],
        meta: {
          timestamp: expect.any(String),
          requestId: undefined
        }
      });
    });

    it('should normalize string errors to objects', () => {
      const error = new Error('Test error') as any;
      error.errors = ['First error', 'Second error'];

      errorHandler(error, mockReq as Request, mockRes as Response, mockNext);

      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          errors: [
            { msg: 'First error' },
            { msg: 'Second error' }
          ]
        })
      );
    });
  });

  describe('Environment-specific behavior', () => {
    it('should not expose stack traces in production', () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'production';

      const error = new Error('Database connection failed');
      error.stack = 'Error: Database\\n  at file.ts:10:5';

      errorHandler(error, mockReq as Request, mockRes as Response, mockNext);

      const response = (mockRes.json as jest.Mock).mock.calls[0][0];
      expect(response).not.toHaveProperty('debug');
      expect(response).not.toHaveProperty('stack');

      process.env.NODE_ENV = originalEnv;
    });

    it('should include debug info in development', () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'development';

      const error = new Error('Test error');
      error.stack = 'Error: Test\\n  at file.ts:10:5';

      errorHandler(error, mockReq as Request, mockRes as Response, mockNext);

      const response = (mockRes.json as jest.Mock).mock.calls[0][0];
      expect(response).toHaveProperty('debug', 'Test error');
      expect(response).toHaveProperty('stack');

      process.env.NODE_ENV = originalEnv;
    });

    it('should include debug info when NODE_ENV is not production', () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'test';

      const error = new Error('Test error');

      errorHandler(error, mockReq as Request, mockRes as Response, mockNext);

      const response = (mockRes.json as jest.Mock).mock.calls[0][0];
      expect(response).toHaveProperty('debug', 'Test error');

      process.env.NODE_ENV = originalEnv;
    });
  });

  describe('Logging behavior', () => {
    it('should log error details with context', () => {
      const error = new Error('Test error');
      error.stack = 'Error: Test\\n  at file.ts:10:5';

      errorHandler(error, mockReq as Request, mockRes as Response, mockNext);

      expect(consoleErrorSpy).toHaveBeenCalledWith('Error occurred:', {
        message: 'Test error',
        stack: expect.any(String),
        path: '/api/test',
        method: 'POST',
        ip: '127.0.0.1',
        userAgent: 'Mozilla/5.0',
        timestamp: expect.any(String)
      });
    });

    it('should not include stack trace in logs for production', () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'production';

      const error = new Error('Test error');

      errorHandler(error, mockReq as Request, mockRes as Response, mockNext);

      expect(consoleErrorSpy).toHaveBeenCalledWith('Error occurred:', {
        message: 'Test error',
        stack: undefined,
        path: '/api/test',
        method: 'POST',
        ip: '127.0.0.1',
        userAgent: 'Mozilla/5.0',
        timestamp: expect.any(String)
      });

      process.env.NODE_ENV = originalEnv;
    });
  });

  describe('Request context handling', () => {
    it('should include requestId when available', () => {
      (mockReq as any).requestId = 'req-123';

      const error = new ValidationError('Test error');

      errorHandler(error, mockReq as Request, mockRes as Response, mockNext);

      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          meta: {
            timestamp: expect.any(String),
            requestId: 'req-123'
          }
        })
      );
    });

    it('should handle missing User-Agent header', () => {
      (mockReq.get as jest.Mock).mockReturnValue(undefined);

      const error = new Error('Test error');

      errorHandler(error, mockReq as Request, mockRes as Response, mockNext);

      expect(consoleErrorSpy).toHaveBeenCalledWith('Error occurred:', 
        expect.objectContaining({
          userAgent: undefined
        })
      );
    });

    it('should handle missing IP address', () => {
      mockReq.ip = undefined;

      const error = new Error('Test error');

      errorHandler(error, mockReq as Request, mockRes as Response, mockNext);

      expect(consoleErrorSpy).toHaveBeenCalledWith('Error occurred:', 
        expect.objectContaining({
          ip: undefined
        })
      );
    });
  });

  describe('Edge cases', () => {
    it('should handle error without message', () => {
      const error = new Error();

      errorHandler(error, mockReq as Request, mockRes as Response, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Erro interno do servidor'
        })
      );
    });

    it('should handle null/undefined errors gracefully', () => {
      const error = null as any;

      errorHandler(error, mockReq as Request, mockRes as Response, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(500);
    });

    it('should handle errors with circular references', () => {
      const error = new Error('Circular reference error') as any;
      error.circular = error; // Create circular reference

      expect(() => {
        errorHandler(error, mockReq as Request, mockRes as Response, mockNext);
      }).not.toThrow();

      expect(mockRes.status).toHaveBeenCalledWith(500);
    });
  });
});