import { Response, NextFunction } from 'express';
import { authenticatePatient, requirePatientEmailVerification, PatientAuthenticatedRequest } from '../../../src/middleware/patientAuth';
import { patientAuthService, PatientTokenPayload } from '../../../src/services/patientAuthService';
import { PatientUser } from '../../../src/models/PatientUser';
import { Patient } from '../../../src/models/Patient';
import mongoose from 'mongoose';

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
      const mockPayload: PatientTokenPayload = {
        patientUserId: new mongoose.Types.ObjectId().toHexString(),
        patientId: new mongoose.Types.ObjectId().toHexString(),
        email: 'test@example.com',
        clinicId: new mongoose.Types.ObjectId().toHexString(),
        type: 'patient' as const
      };

      const mockPatientUser = {
        _id: mockPayload.patientUserId,
        patient: mockPayload.patientId,
        emailVerified: true,
        isActive: true,
      };

      const mockPatient = {
        _id: mockPayload.patientId,
        name: 'Test Patient',
        status: 'active'
      };

      req.cookies = { patientAccessToken: 'valid-token' };

      mockedPatientAuthService.verifyToken.mockResolvedValue(mockPayload);
      jest.spyOn(PatientUser, 'findById').mockResolvedValue(mockPatientUser as any);
      jest.spyOn(Patient, 'findById').mockResolvedValue(mockPatient as any);

      await authenticatePatient(req as PatientAuthenticatedRequest, res as Response, next);

      expect(mockedPatientAuthService.verifyToken).toHaveBeenCalledWith('valid-token');
      expect(next).toHaveBeenCalled();
      expect(req.patientUser).toBeDefined();
      expect(req.patient).toBeDefined();
    });

    it('should authenticate valid patient token from Authorization header', async () => {
        const mockPayload: PatientTokenPayload = {
            patientUserId: new mongoose.Types.ObjectId().toHexString(),
            patientId: new mongoose.Types.ObjectId().toHexString(),
            email: 'test@example.com',
            clinicId: new mongoose.Types.ObjectId().toHexString(),
            type: 'patient' as const
          };
    
          const mockPatientUser = {
            _id: mockPayload.patientUserId,
            patient: mockPayload.patientId,
            emailVerified: true,
            isActive: true,
          };
    
          const mockPatient = {
            _id: mockPayload.patientId,
            name: 'Test Patient',
            status: 'active'
          };
    
          req.headers = { authorization: 'Bearer valid-token' };
          req.cookies = {};
    
          mockedPatientAuthService.verifyToken.mockResolvedValue(mockPayload);
          jest.spyOn(PatientUser, 'findById').mockResolvedValue(mockPatientUser as any);
          jest.spyOn(Patient, 'findById').mockResolvedValue(mockPatient as any);
    
          await authenticatePatient(req as PatientAuthenticatedRequest, res as Response, next);
    
          expect(mockedPatientAuthService.verifyToken).toHaveBeenCalledWith('valid-token');
          expect(next).toHaveBeenCalled();
    });

    it('should return 401 for missing token', async () => {
      req.cookies = {};
      req.headers = {};

      await authenticatePatient(req as PatientAuthenticatedRequest, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        success: false,
        message: 'Token de acesso não fornecido'
      }));
      expect(next).not.toHaveBeenCalled();
    });

    it('should return 401 for invalid token', async () => {
      req.cookies = { patientAccessToken: 'invalid-token' };

      mockedPatientAuthService.verifyToken.mockRejectedValue(new Error('Invalid token'));

      await authenticatePatient(req as PatientAuthenticatedRequest, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        success: false,
        message: 'Token inválido'
      }));
      expect(res.clearCookie).toHaveBeenCalledWith('patientAccessToken');
      expect(next).not.toHaveBeenCalled();
    });

    it('should return 401 for inactive patient user', async () => {
        const mockPayload: PatientTokenPayload = {
            patientUserId: new mongoose.Types.ObjectId().toHexString(),
            patientId: new mongoose.Types.ObjectId().toHexString(),
            email: 'test@example.com',
            clinicId: new mongoose.Types.ObjectId().toHexString(),
            type: 'patient' as const
          };
    
          const mockPatientUser = {
            _id: mockPayload.patientUserId,
            patient: mockPayload.patientId,
            emailVerified: true,
            isActive: false,
          };
    
          req.cookies = { patientAccessToken: 'valid-token' };
    
          mockedPatientAuthService.verifyToken.mockResolvedValue(mockPayload);
          jest.spyOn(PatientUser, 'findById').mockResolvedValue(mockPatientUser as any);
    
          await authenticatePatient(req as PatientAuthenticatedRequest, res as Response, next);
    
          expect(res.status).toHaveBeenCalledWith(401);
          expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
            success: false,
            message: 'Conta de paciente inativa'
          }));
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
            emailVerified: false,
            email: 'test@example.com'
        } as any;
        req.patient = {
            _id: 'patient123'
        } as any;

      requirePatientEmailVerification(req as PatientAuthenticatedRequest, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        success: false,
        message: 'E-mail não verificado. Verifique seu e-mail antes de continuar.'
      }));
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