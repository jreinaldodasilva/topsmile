import { authenticate, authorize } from '../../../src/middleware/auth';
import { Request, Response, NextFunction } from 'express';

describe('Auth Middleware', () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    mockReq = { headers: {} };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    mockNext = jest.fn();
  });

  describe('authenticate', () => {
    it('should reject missing token', () => {
      authenticate(mockReq as Request, mockRes as Response, mockNext);
      
      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should reject invalid token', () => {
      mockReq.headers = { authorization: 'Bearer invalid' };
      
      authenticate(mockReq as Request, mockRes as Response, mockNext);
      
      expect(mockRes.status).toHaveBeenCalledWith(401);
    });
  });

  describe('authorize', () => {
    it('should allow authorized role', () => {
      mockReq.user = { role: 'admin' };
      
      authorize('admin')(mockReq as Request, mockRes as Response, mockNext);
      
      expect(mockNext).toHaveBeenCalled();
    });

    it('should reject unauthorized role', () => {
      mockReq.user = { role: 'staff' };
      
      authorize('admin')(mockReq as Request, mockRes as Response, mockNext);
      
      expect(mockRes.status).toHaveBeenCalledWith(403);
    });
  });
});
