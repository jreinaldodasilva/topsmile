import { Request, Response, NextFunction } from 'express';
import { authenticate, authorize, AuthenticatedRequest } from '../../../src/middleware/auth';
import { authService } from '../../../src/services/authService';
import jwt from 'jsonwebtoken';

// Mock the authService
jest.mock('../../../src/services/authService');
const mockAuthService = authService as jest.Mocked<typeof authService>;

describe('Auth Middleware', () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    mockReq = {
      headers: {},
      cookies: {}
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    mockNext = jest.fn();
    jest.clearAllMocks();
  });

  describe('authenticate middleware', () => {
    it('should call next() for valid JWT token in Authorization header', async () => {
      const mockPayload = {
        userId: '123',
        email: 'test@example.com',
        role: 'admin'
      };

      mockAuthService.verifyAccessToken.mockReturnValue(mockPayload);
      mockAuthService.getUserById.mockResolvedValue({
        id: '123',
        email: 'test@example.com',
        role: 'admin',
        name: 'Test User',
        isActive: true
      } as any);

      mockReq.headers = { authorization: 'Bearer valid-token' };

      await authenticate(mockReq as Request, mockRes as Response, mockNext);

      expect(mockAuthService.verifyAccessToken).toHaveBeenCalledWith('valid-token');
      expect(mockNext).toHaveBeenCalled();
      expect((mockReq as AuthenticatedRequest).user).toMatchObject({
        id: '123',
        email: 'test@example.com',
        role: 'admin'
      });
    });

    it('should call next() for valid JWT token in cookies', async () => {
      const mockPayload = {
        userId: '123',
        email: 'test@example.com',
        role: 'admin'
      };

      mockAuthService.verifyAccessToken.mockReturnValue(mockPayload);
      mockReq.cookies = { topsmile_access_token: 'valid-token' };

      await authenticate(mockReq as Request, mockRes as Response, mockNext);

      expect(mockAuthService.verifyAccessToken).toHaveBeenCalledWith('valid-token');
      expect(mockNext).toHaveBeenCalled();
    });

    it('should return 401 if no token provided', async () => {
      await authenticate(mockReq as Request, mockRes as Response, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'Token de acesso obrigatório',
        code: 'NO_TOKEN'
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should return 401 for expired token', async () => {
      mockAuthService.verifyAccessToken.mockImplementation(() => {
        const error = new jwt.TokenExpiredError('jwt expired', new Date());
        throw error;
      });

      mockReq.headers = { authorization: 'Bearer expired-token' };

      await authenticate(mockReq as Request, mockRes as Response, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'Token expirado',
        code: 'TOKEN_EXPIRED'
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should return 401 for invalid token signature', async () => {
      mockAuthService.verifyAccessToken.mockImplementation(() => {
        throw new jwt.JsonWebTokenError('invalid signature');
      });

      mockReq.headers = { authorization: 'Bearer invalid-token' };

      await authenticate(mockReq as Request, mockRes as Response, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'Token inválido',
        code: 'INVALID_TOKEN'
      });
    });

    it('should return 401 for malformed authorization header', async () => {
      mockReq.headers = { authorization: 'InvalidFormat token' };

      await authenticate(mockReq as Request, mockRes as Response, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'Formato de token inválido',
        code: 'INVALID_TOKEN_FORMAT'
      });
    });

    it('should handle token without Bearer prefix', async () => {
      mockReq.headers = { authorization: 'just-a-token' };

      await authenticate(mockReq as Request, mockRes as Response, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'Formato de token inválido',
        code: 'INVALID_TOKEN_FORMAT'
      });
    });
  });

  describe('authorize middleware', () => {
    beforeEach(() => {
      (mockReq as AuthenticatedRequest).user = {
        id: '123',
        email: 'test@example.com',
        role: 'admin',
        name: 'Test User'
      };
    });

    it('should allow access for super_admin to any role', () => {
      (mockReq as AuthenticatedRequest).user!.role = 'super_admin';
      const middleware = authorize('admin', 'manager');

      middleware(mockReq as Request, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalled();
      expect(mockRes.status).not.toHaveBeenCalled();
    });

    it('should allow access when user role is in allowed roles', () => {
      (mockReq as AuthenticatedRequest).user!.role = 'admin';
      const middleware = authorize('admin', 'manager');

      middleware(mockReq as Request, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalled();
      expect(mockRes.status).not.toHaveBeenCalled();
    });

    it('should deny access when user role is not in allowed roles', () => {
      (mockReq as AuthenticatedRequest).user!.role = 'assistant';
      const middleware = authorize('admin', 'manager');

      middleware(mockReq as Request, mockRes as Response, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(403);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'Permissões insuficientes para esta operação',
        code: 'INSUFFICIENT_ROLE'
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should return 401 if user is not authenticated', () => {
      delete (mockReq as AuthenticatedRequest).user;
      const middleware = authorize('admin');

      middleware(mockReq as Request, mockRes as Response, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'Autenticação obrigatória',
        code: 'NOT_AUTHENTICATED'
      });
    });

    it('should return 403 if user has no role defined', () => {
      delete (mockReq as AuthenticatedRequest).user!.role;
      const middleware = authorize('admin');

      middleware(mockReq as Request, mockRes as Response, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(403);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'Permissões de usuário não definidas',
        code: 'NO_ROLE'
      });
    });

    it('should allow access when no specific roles are required', () => {
      (mockReq as AuthenticatedRequest).user!.role = 'assistant';
      const middleware = authorize(); // No roles specified

      middleware(mockReq as Request, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalled();
    });
  });

  describe('edge cases and security', () => {
    it('should handle empty authorization header', async () => {
      mockReq.headers = { authorization: '' };

      await authenticate(mockReq as Request, mockRes as Response, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should handle authorization header with only Bearer', async () => {
      mockReq.headers = { authorization: 'Bearer' };

      await authenticate(mockReq as Request, mockRes as Response, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should handle authorization header with extra spaces', async () => {
      const mockPayload = {
        userId: '123',
        email: 'test@example.com',
        role: 'admin'
      };

      mockAuthService.verifyAccessToken.mockReturnValue(mockPayload);
      mockReq.headers = { authorization: '  Bearer   valid-token  ' };

      await authenticate(mockReq as Request, mockRes as Response, mockNext);

      expect(mockAuthService.verifyAccessToken).toHaveBeenCalledWith('valid-token');
      expect(mockNext).toHaveBeenCalled();
    });

    it('should not expose sensitive error details in production', async () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'production';

      mockAuthService.verifyAccessToken.mockImplementation(() => {
        throw new Error('Database connection failed');
      });

      mockReq.headers = { authorization: 'Bearer some-token' };

      await authenticate(mockReq as Request, mockRes as Response, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'Token inválido',
        code: 'INVALID_TOKEN'
      });

      process.env.NODE_ENV = originalEnv;
    });

    it('should handle concurrent requests with same token', async () => {
      const mockPayload = {
        userId: '123',
        email: 'test@example.com',
        role: 'admin'
      };

      mockAuthService.verifyAccessToken.mockReturnValue(mockPayload);
      mockReq.headers = { authorization: 'Bearer valid-token' };

      // Simulate concurrent requests
      const promises = Array(5).fill(null).map(() =>
        authenticate(mockReq as Request, mockRes as Response, mockNext)
      );

      await Promise.all(promises);

      expect(mockAuthService.verifyAccessToken).toHaveBeenCalledTimes(5);
      expect(mockNext).toHaveBeenCalledTimes(5);
    });
  });
});