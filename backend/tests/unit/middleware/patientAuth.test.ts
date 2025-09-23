import { Request, Response, NextFunction } from 'express';
import { authenticatePatient, requirePatientEmailVerification, PatientAuthenticatedRequest } from '../../../src/middleware/patientAuth';
import { patientAuthService } from '../../../src/services/patientAuthService';
import { createTestClinic, createTestPatient, createTestPatientUser } from '../../testHelpers';

// Mock the patientAuthService
jest.mock('../../../src/services/patientAuthService');
const mockedPatientAuthService = patientAuthService as jest.Mocked<typeof patientAuthService>;

describe('Patient Auth Middleware', () => {
  let req: Partial<PatientAuthenticatedRequest>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    req = {
      cookies: {},
      headers: {}
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      clearCookie: jest.fn().mockReturnThis()
    };
    next = jest.fn();
    jest.clearAllMocks();
  });

  describe('authenticatePatient', () => {
    it('should authenticate valid patient token from cookies', async () => {
      const mockPayload = {
        patientUserId: 'user123',
        patientId: 'patient123',
        email: 'test@example.com',
        clinicId: 'clinic123',
        type: 'patient' as const
      };

      const mockPatientUser = {
        _id: 'user123',
        email: 'test@example.com',
        isActive: true,
        emailVerified: true
      };

      const mockPatient = {
        _id: 'patient123',
        name: 'Test Patient',
        status: 'active'
      };

      req.cookies = { patientAccessToken: 'valid-token' };

      mockedPatientAuthService.verifyToken.mockResolvedValue(mockPayload);
      // Mock database queries
      jest.doMock('../../../src/models/PatientUser', () => ({
        PatientUser: {
          findById: jest.fn().mockResolvedValue(mockPatientUser)
        }
      }));
      jest.doMock('../../../src/models/Patient', () => ({
        Patient: {
          findById: jest.fn().mockResolvedValue(mockPatient)
        }
      }));

      await authenticatePatient(req as PatientAuthenticatedRequest, res as Response, next);

      expect(mockedPatientAuthService.verifyToken).toHaveBeenCalledWith('valid-token');
      expect(next).toHaveBeenCalled();
      expect(req.patientUser).toBeDefined();
      expect(req.patient).toBeDefined();
    });

    it('should authenticate valid patient token from Authorization header', async () => {
      const mockPayload = {
        patientUserId: 'user123',
        patientId: 'patient123',
        email: 'test@example.com',
        clinicId: 'clinic123',
        type: 'patient' as const
      };

      req.headers = { authorization: 'Bearer valid-token' };
      req.cookies = {};

      mockedPatientAuthService.verifyToken.mockResolvedValue(mockPayload);

      await authenticatePatient(req as PatientAuthenticatedRequest, res as Response, next);

      expect(mockedPatientAuthService.verifyToken).toHaveBeenCalledWith('valid-token');
      expect(next).toHaveBeenCalled();
    });

    it('should return 401 for missing token', async () => {
      req.cookies = {};
      req.headers = {};

      await authenticatePatient(req as PatientAuthenticatedRequest, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Token de acesso obrigatório'
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('should return 401 for invalid token', async () => {
      req.cookies = { patientAccessToken: 'invalid-token' };

      mockedPatientAuthService.verifyToken.mockRejectedValue(new Error('Invalid token'));

      await authenticatePatient(req as PatientAuthenticatedRequest, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Token inválido'
      });
      expect(res.clearCookie).toHaveBeenCalledWith('patientAccessToken');
      expect(next).not.toHaveBeenCalled();
    });

    it('should return 401 for inactive patient user', async () => {
      const mockPayload = {
        patientUserId: 'user123',
        patientId: 'patient123',
        email: 'test@example.com',
        clinicId: 'clinic123',
        type: 'patient' as const
      };

      const mockPatientUser = {
        _id: 'user123',
        email: 'test@example.com',
        isActive: false, // Inactive user
        emailVerified: true
      };

      req.cookies = { patientAccessToken: 'valid-token' };

      mockedPatientAuthService.verifyToken.mockResolvedValue(mockPayload);

      await authenticatePatient(req as PatientAuthenticatedRequest, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Conta desativada'
      });
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe('requirePatientEmailVerification', () => {
    it('should allow access for verified email', () => {
      req.patientUser = {
        emailVerified: true
      } as any;

      requirePatientEmailVerification(req as PatientAuthenticatedRequest, res as Response, next);

      expect(next).toHaveBeenCalled();
    });

    it('should return 403 for unverified email', () => {
      req.patientUser = {
        emailVerified: false
      } as any;

      requirePatientEmailVerification(req as PatientAuthenticatedRequest, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'E-mail não verificado. Verifique seu e-mail antes de continuar.',
        requiresEmailVerification: true
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('should return 401 for missing patient user', () => {
      req.patientUser = undefined;

      requirePatientEmailVerification(req as PatientAuthenticatedRequest, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Usuário não autenticado'
      });
      expect(next).not.toHaveBeenCalled();
    });
  });
});