import { requirePermission, requireOwnershipOrAdmin, requireSameClinic } from '../../../src/middleware/roleBasedAccess';

describe('Role-Based Access Middleware', () => {
  let req: any;
  let res: any;
  let next: jest.Mock;

  beforeEach(() => {
    req = {
      user: null,
      params: {}
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    next = jest.fn();
    jest.clearAllMocks();
  });

  describe('requirePermission', () => {
    it('should allow admin access', () => {
      req.user = { role: 'admin', clinic: 'clinic123' };
      const middleware = requirePermission('manage_patients');

      middleware(req, res, next);

      expect(next).toHaveBeenCalled();
    });

    it('should allow user with specific permission', () => {
      req.user = { role: 'dentist', clinic: 'clinic123' };
      const middleware = requirePermission('view_patients');

      middleware(req, res, next);

      expect(next).toHaveBeenCalled();
    });

    it('should deny user without permission', () => {
      req.user = { role: 'assistant', clinic: 'clinic123' };
      const middleware = requirePermission('manage_users');

      middleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Insufficient permissions'
      });
    });
  });

  describe('requireOwnershipOrAdmin', () => {
    it('should allow admin access', () => {
      req.user = { _id: 'user123', role: 'admin' };
      req.params.userId = 'otheruser';
      const middleware = requireOwnershipOrAdmin('userId');

      middleware(req, res, next);

      expect(next).toHaveBeenCalled();
    });

    it('should allow owner access', () => {
      req.user = { _id: 'user123', role: 'patient' };
      req.params.userId = 'user123';
      const middleware = requireOwnershipOrAdmin('userId');

      middleware(req, res, next);

      expect(next).toHaveBeenCalled();
    });

    it('should deny non-owner non-admin', () => {
      req.user = { _id: 'user123', role: 'patient' };
      req.params.userId = 'otheruser';
      const middleware = requireOwnershipOrAdmin('userId');

      middleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(403);
    });
  });

  describe('requireSameClinic', () => {
    it('should allow same clinic access', () => {
      req.user = { clinic: 'clinic123', role: 'dentist' };
      req.params.clinicId = 'clinic123';
      const middleware = requireSameClinic('clinicId');

      middleware(req, res, next);

      expect(next).toHaveBeenCalled();
    });

    it('should deny different clinic access', () => {
      req.user = { clinic: 'clinic123', role: 'dentist' };
      req.params.clinicId = 'clinic456';
      const middleware = requireSameClinic('clinicId');

      middleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(403);
    });

    it('should allow admin cross-clinic access', () => {
      req.user = { clinic: 'clinic123', role: 'admin' };
      req.params.clinicId = 'clinic456';
      const middleware = requireSameClinic('clinicId');

      middleware(req, res, next);

      expect(next).toHaveBeenCalled();
    });
  });
});