import { authenticate, authorize } from '../../../src/middleware/auth';
import { User } from '../../../src/models/User';
import { TEST_CREDENTIALS } from '../../testConstants';
import jwt from 'jsonwebtoken';

jest.mock('../../../src/models/User');
jest.mock('jsonwebtoken');

describe('Auth Middleware', () => {
  let req: any;
  let res: any;
  let next: jest.Mock;

  beforeEach(() => {
    req = {
      headers: {},
      user: null
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    next = jest.fn();
    jest.clearAllMocks();
  });

  describe('authenticate', () => {
    it('should authenticate valid token', async () => {
      const mockUser = { _id: 'user123', role: 'admin' };
      req.headers.authorization = 'Bearer validtoken';
      (jwt.verify as jest.Mock).mockReturnValue({ userId: 'user123' });
      (User.findById as jest.Mock).mockResolvedValue(mockUser);

      await authenticate(req, res, next);

      expect(req.user).toEqual(mockUser);
      expect(next).toHaveBeenCalled();
    });

    it('should reject missing token', async () => {
      await authenticate(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Authentication required'
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('should reject invalid token', async () => {
      req.headers.authorization = 'Bearer invalidtoken';
      (jwt.verify as jest.Mock).mockImplementation(() => {
        throw new Error('Invalid token');
      });

      await authenticate(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(next).not.toHaveBeenCalled();
    });

    it('should reject token for non-existent user', async () => {
      req.headers.authorization = 'Bearer validtoken';
      (jwt.verify as jest.Mock).mockReturnValue({ userId: 'user123' });
      (User.findById as jest.Mock).mockResolvedValue(null);

      await authenticate(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe('authorize', () => {
    it('should authorize user with correct role', () => {
      req.user = { role: 'admin' };
      const middleware = authorize(['admin']);

      middleware(req, res, next);

      expect(next).toHaveBeenCalled();
    });

    it('should reject user with incorrect role', () => {
      req.user = { role: 'patient' };
      const middleware = authorize(['admin']);

      middleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Insufficient permissions'
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('should authorize user with multiple allowed roles', () => {
      req.user = { role: 'dentist' };
      const middleware = authorize(['admin', 'dentist']);

      middleware(req, res, next);

      expect(next).toHaveBeenCalled();
    });
  });
});