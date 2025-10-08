import { PatientUser, IPatientUser } from '../../models/PatientUser';
import { Patient } from '../../models/Patient';
import { Patient as IPatient } from '@topsmile/types';
import { Request, Response, NextFunction } from 'express';
import { patientAuthService, PatientTokenPayload } from '../../services/auth/patientAuthService';
import { BaseAuthMiddleware } from '../shared/baseAuth';
import { ApiResponse } from '../../utils/responseHelpers';

export interface PatientAuthenticatedRequest extends Request {
  patientUser?: IPatientUser;
  patient?: IPatient;
  tokenPayload?: PatientTokenPayload;
}

class PatientAuthMiddleware extends BaseAuthMiddleware {
  protected getCookieTokens(cookies: any): string | null {
    return cookies?.patientAccessToken || null;
  }

  protected async verifyToken(token: string): Promise<any> {
    return patientAuthService.verifyToken(token);
  }

  protected async attachUserToRequest(req: Request, payload: any): Promise<void> {
    const patientUser = await PatientUser.findById(payload.patientUserId);
    if (!patientUser) {
      throw new Error('Token inválido');
    }

    if (!patientUser.isActive) {
      throw new Error('Conta de paciente inativa');
    }

    const patient = await Patient.findById(payload.patientId);
    if (!patient) {
      throw new Error('Token inválido');
    }

    const authReq = req as PatientAuthenticatedRequest;
    authReq.patientUser = patientUser;
    authReq.patient = patient;
    authReq.tokenPayload = payload;
  }

  protected handleAuthError(res: Response, error: any): void {
    // Clear cookie on auth failure
    res.clearCookie('patientAccessToken');
    ApiResponse.error(res, 401, 'Token inválido', 'PATIENT_AUTH_FAILED');
  }
}

const patientAuth = new PatientAuthMiddleware();

export const authenticatePatient = patientAuth.authenticate.bind(patientAuth);

export const requirePatientEmailVerification = (
  req: PatientAuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  if (!req.patientUser) {
    ApiResponse.unauthorized(res, 'Usuário não autenticado');
    return;
  }

  if (!req.patientUser.emailVerified) {
    ApiResponse.error(res, 403, 'E-mail não verificado. Verifique seu e-mail antes de continuar.', 'EMAIL_NOT_VERIFIED', [
      {
        msg: `E-mail ${req.patientUser.email} não verificado`,
        param: 'emailVerified'
      }
    ]);
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
    ApiResponse.unauthorized(res, 'Dados de autenticação incompletos', 'CLINIC_ACCESS_DENIED');
    return;
  }

  const patientClinicId = (req.patient.clinic as any)?._id || req.patient.clinic;
  const tokenClinicId = req.tokenPayload.clinicId;

  if (!patientClinicId || !tokenClinicId) {
    ApiResponse.forbidden(res, 'Informações de clínica não encontradas', 'CLINIC_ACCESS_DENIED');
    return;
  }

  if (patientClinicId.toString() !== tokenClinicId.toString()) {
    ApiResponse.forbidden(res, 'Acesso negado: clínica não autorizada', 'CLINIC_ACCESS_DENIED');
    return;
  }

  next();
};

export const optionalPatientAuth = patientAuth.optionalAuth.bind(patientAuth);