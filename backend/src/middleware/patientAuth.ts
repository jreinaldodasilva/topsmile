import jwt from 'jsonwebtoken';
import { PatientUser, IPatientUser } from '../models/PatientUser';
import { Patient as IPatient } from '@topsmile/types';
import { Request, Response, NextFunction } from 'express';
import { UnauthorizedError, ForbiddenError } from '../types/errors';

// IMPROVED: Proper typing for patient authentication
export interface PatientTokenPayload {
  patientUserId: string;
  patientId: string;
  email: string;
  type: 'patient';
  clinicId: string;
  iat?: number;
  exp?: number;
}

export interface PatientAuthenticatedRequest extends Request {
  patientUser?: IPatientUser;
  patient?: IPatient;
  tokenPayload?: PatientTokenPayload;
}

// IMPROVED: Better error handling and security
export const authenticatePatient = async (
  req: PatientAuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Read token from cookies instead of Authorization header
    const token = req.cookies?.patientAccessToken;

    if (!token || typeof token !== 'string') {
      throw new UnauthorizedError('Token de acesso não fornecido');
    }

    try {
      // Use patient-specific JWT secret
      const jwtSecret = process.env.PATIENT_JWT_SECRET || process.env.JWT_SECRET;
      if (!jwtSecret) {
        console.error('PATIENT_JWT_SECRET not configured for patient authentication');
        throw new Error('Server configuration error');
      }

      const decoded = jwt.verify(token, jwtSecret, {
        algorithms: ['HS256'], // Explicit algorithm
        issuer: 'topsmile-patient-portal',
        audience: 'topsmile-patients'
      }) as PatientTokenPayload;

      // IMPROVED: Validate token payload structure
      if (!decoded || typeof decoded !== 'object') {
        throw new UnauthorizedError('Formato de token inválido');
      }

      if (decoded.type !== 'patient') {
        throw new UnauthorizedError('Token não é válido para acesso de pacientes');
      }

      if (!decoded.patientUserId || !decoded.patientId) {
        throw new UnauthorizedError('Token com dados incompletos');
      }

      // Single database query with population
      const patientUser = await PatientUser.findById(decoded.patientUserId)
        .populate({
          path: 'patient',
          select: 'firstName lastName email phone clinic dateOfBirth address emergencyContact medicalHistory status',
          populate: {
            path: 'clinic',
            select: 'name address phone email'
          }
        });

      if (!patientUser) {
        throw new UnauthorizedError('Usuário não encontrado');
      }

      if (!patientUser.isActive) {
        throw new UnauthorizedError('Conta desativada');
      }

      if (!patientUser.patient) {
        throw new UnauthorizedError('Dados do paciente não encontrados');
      }

      // Check if patient is still active
      const patient = patientUser.patient as any;
      if (patient && patient.status !== 'active') {
        throw new UnauthorizedError('Cadastro de paciente inativo');
      }

      // Attach to request
      req.patientUser = patientUser;
      req.patient = patientUser.patient as unknown as IPatient;
      req.tokenPayload = decoded;

      next();
    } catch (jwtError) {
      if (jwtError instanceof jwt.JsonWebTokenError) {
        throw new UnauthorizedError('Token inválido');
      } else if (jwtError instanceof jwt.TokenExpiredError) {
        throw new UnauthorizedError('Token expirado');
      } else if (jwtError instanceof jwt.NotBeforeError) {
        throw new UnauthorizedError('Token ainda não é válido');
      }
      throw jwtError;
    }
  } catch (error) {
    console.error('Patient authentication error:', error);

    if (error instanceof UnauthorizedError) {
      res.status(401).json({
        success: false,
        message: error.message,
        code: 'PATIENT_AUTH_FAILED'
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
      code: 'INTERNAL_ERROR'
    });
  }
};

// IMPROVED: Email verification middleware with better error handling
export const requirePatientEmailVerification = (
  req: PatientAuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  try {
    if (!req.patientUser) {
      throw new UnauthorizedError('Autenticação necessária');
    }

    if (!req.patientUser.emailVerified) {
      throw new ForbiddenError('E-mail não verificado. Verifique seu e-mail antes de continuar.');
    }

    next();
  } catch (error) {
    if (error instanceof ForbiddenError) {
      res.status(403).json({
        success: false,
        message: error.message,
        code: 'EMAIL_NOT_VERIFIED',
        data: {
          email: req.patientUser?.email,
          resendVerificationUrl: '/api/patient-auth/resend-verification'
        }
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
};

// IMPROVED: Clinic access control for patient data
export const ensurePatientClinicAccess = (
  req: PatientAuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  try {
    if (!req.patient || !req.tokenPayload) {
      throw new UnauthorizedError('Dados de autenticação incompletos');
    }

    const patientClinicId = (req.patient.clinic as any)?._id || req.patient.clinic;
    const tokenClinicId = req.tokenPayload.clinicId;

    if (!patientClinicId || !tokenClinicId) {
      throw new ForbiddenError('Informações de clínica não encontradas');
    }

    if (patientClinicId.toString() !== tokenClinicId.toString()) {
      throw new ForbiddenError('Acesso negado: clínica não autorizada');
    }

    next();
  } catch (error) {
    if (error instanceof ForbiddenError || error instanceof UnauthorizedError) {
      res.status(error.statusCode).json({
        success: false,
        message: error.message,
        code: 'CLINIC_ACCESS_DENIED'
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
};

// IMPROVED: Optional patient authentication (for public endpoints that can benefit from patient context)
export const optionalPatientAuth = async (
  req: PatientAuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      
      if (token) {
        try {
          const jwtSecret = process.env.JWT_SECRET || process.env.PATIENT_JWT_SECRET;
          if (jwtSecret) {
            const decoded = jwt.verify(token, jwtSecret) as PatientTokenPayload;
            
            if (decoded && decoded.type === 'patient' && decoded.patientUserId) {
              const patientUser = await PatientUser.findById(decoded.patientUserId)
                .populate('patient');
              
              if (patientUser && patientUser.isActive) {
                req.patientUser = patientUser;
                req.patient = patientUser.patient as unknown as IPatient;
                req.tokenPayload = decoded;
              }
            }
          }
        } catch (error) {
          // Silently fail for optional auth
          console.warn('Optional patient auth failed:', error instanceof Error ? error.message : 'Unknown error');
        }
      }
    }

    next();
  } catch (error) {
    // Never fail on optional auth
    next();
  }
};