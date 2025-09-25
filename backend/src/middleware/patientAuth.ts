import { PatientUser, IPatientUser } from '../models/PatientUser';
import { Patient } from '../models/Patient';
import { Patient as IPatient } from '@topsmile/types';
import { Request, Response, NextFunction } from 'express';
import { patientAuthService, PatientTokenPayload } from '../services/patientAuthService';

export interface PatientAuthenticatedRequest extends Request {
  patientUser?: IPatientUser;
  patient?: IPatient;
  tokenPayload?: PatientTokenPayload;
}

export const authenticatePatient = async (
  req: PatientAuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Get token from cookies or Authorization header
    let token = req.cookies?.patientAccessToken;
    
    if (!token && req.headers.authorization?.startsWith('Bearer ')) {
      token = req.headers.authorization.substring(7);
    }

    if (!token) {
      res.status(401).json({
        success: false,
        message: 'Token de acesso não fornecido',
        code: 'PATIENT_AUTH_FAILED'
      });
      return;
    }

    try {
      const decoded = await patientAuthService.verifyToken(token);

      const patientUser = await PatientUser.findById(decoded.patientUserId);
      if (!patientUser) {
        res.status(401).json({
          success: false,
          message: 'Token inválido',
          code: 'PATIENT_AUTH_FAILED'
        });
        return;
      }

      if (!patientUser.isActive) {
        res.status(401).json({
          success: false,
          message: 'Conta de paciente inativa',
          code: 'PATIENT_AUTH_FAILED'
        });
        return;
      }

      const patient = await Patient.findById(decoded.patientId);
      if (!patient) {
        res.status(401).json({
          success: false,
          message: 'Token inválido',
          code: 'PATIENT_AUTH_FAILED'
        });
        return;
      }

      req.patientUser = patientUser;
      req.patient = patient;
      req.tokenPayload = decoded;

      next();
    } catch (error) {
      if (req.cookies?.patientAccessToken) {
        res.clearCookie('patientAccessToken');
      }
      res.status(401).json({
        success: false,
        message: 'Token inválido',
        code: 'PATIENT_AUTH_FAILED'
      });
    }
  } catch (error) {
    console.error('Patient authentication error:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
      code: 'INTERNAL_ERROR'
    });
  }
};

export const requirePatientEmailVerification = (
  req: PatientAuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  if (!req.patientUser) {
    res.status(401).json({
      success: false,
      message: 'Usuário não autenticado'
    });
    return;
  }

  if (!req.patientUser.emailVerified) {
    res.status(403).json({
      success: false,
      message: 'E-mail não verificado. Verifique seu e-mail antes de continuar.',
      code: 'EMAIL_NOT_VERIFIED',
      data: {
        email: req.patientUser.email,
        resendVerificationUrl: '/api/patient-auth/resend-verification'
      }
    });
    return;
  }

  next();
};

export const ensurePatientClinicAccess = (
  req: PatientAuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  if (!req.patient || !req.tokenPayload) {
    res.status(401).json({
      success: false,
      message: 'Dados de autenticação incompletos',
      code: 'CLINIC_ACCESS_DENIED'
    });
    return;
  }

  const patientClinicId = (req.patient.clinic as any)?._id || req.patient.clinic;
  const tokenClinicId = req.tokenPayload.clinicId;

  if (!patientClinicId || !tokenClinicId) {
    res.status(403).json({
      success: false,
      message: 'Informações de clínica não encontradas',
      code: 'CLINIC_ACCESS_DENIED'
    });
    return;
  }

  if (patientClinicId.toString() !== tokenClinicId.toString()) {
    res.status(403).json({
      success: false,
      message: 'Acesso negado: clínica não autorizada',
      code: 'CLINIC_ACCESS_DENIED'
    });
    return;
  }

  next();
};

export const optionalPatientAuth = async (
  req: PatientAuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    let token = req.cookies?.patientAccessToken;
    
    if (!token && req.headers.authorization?.startsWith('Bearer ')) {
      token = req.headers.authorization.substring(7);
    }

    if (token) {
      try {
        const decoded = await patientAuthService.verifyToken(token);
        const patientUser = await PatientUser.findById(decoded.patientUserId);
        const patient = await Patient.findById(decoded.patientId);
        
        if (patientUser && patientUser.isActive && patient) {
          req.patientUser = patientUser;
          req.patient = patient;
          req.tokenPayload = decoded;
        }
      } catch (error) {
        // Silently fail for optional auth
        console.warn('Optional patient auth failed:', error instanceof Error ? error.message : 'Unknown error');
      }
    }

    next();
  } catch (error) {
    // Never fail on optional auth
    next();
  }
};