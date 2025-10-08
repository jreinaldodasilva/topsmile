import { Request, Response, NextFunction } from 'express';
import { authService } from '../../services/auth';
import type { Clinic, User } from '@topsmile/types';
import { BaseAuthMiddleware } from '../shared/baseAuth';
import { ApiResponse } from '../../utils/responseHelpers';

type UserRole = 'super_admin' | 'admin' | 'manager' | 'dentist' | 'assistant';

export interface AuthUser extends User {
  clinicId?: string;
}

export type AuthenticatedRequest = Request & {
  user?: AuthUser;
}

class StaffAuthMiddleware extends BaseAuthMiddleware {
  protected getCookieTokens(cookies: any): string | null {
    return cookies['topsmile_access_token'] ||
           cookies['topsmile_token'] ||
           cookies['access_token'] ||
           null;
  }

  protected async verifyToken(token: string): Promise<any> {
    return authService.verifyAccessToken(token);
  }

  protected async attachUserToRequest(req: Request, payload: any): Promise<void> {
    if (!payload || !payload.userId) {
      throw new Error('Invalid token format');
    }

    const userId = payload.userId;
    if (!userId) {
      throw new Error('Invalid token payload');
    }

    (req as AuthenticatedRequest).user = {
      id: String(userId),
      email: payload.email,
      role: payload.role as UserRole,
      clinicId: payload.clinicId,
      name: payload.name || payload.email || 'Unknown User',
    };

    // Optional: Verify user still exists and is active
    if (process.env.VERIFY_USER_ON_REQUEST === 'true') {
      const currentUser = (req as AuthenticatedRequest).user;
      if (currentUser?.id) {
        const user = await authService.getUserById(currentUser.id);
        if (!user.isActive) {
          throw new Error('User inactive');
        }
      }
    }
  }
}

const staffAuth = new StaffAuthMiddleware();

export const authenticate = staffAuth.authenticate.bind(staffAuth);

export const authorize = (...allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const authReq = req as AuthenticatedRequest;
    if (!authReq.user) {
      ApiResponse.unauthorized(res, 'Autenticação obrigatória', 'NOT_AUTHENTICATED');
      return;
    }

    const userRole = authReq.user.role;
    
    if (!userRole) {
      ApiResponse.forbidden(res, 'Permissões de usuário não definidas', 'NO_ROLE');
      return;
    }

    // Super admin has access to everything
    if (userRole === 'super_admin') {
      next();
      return;
    }

    // Check if user's role is in allowed roles
    if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
      ApiResponse.insufficientRole(res);
      return;
    }

    next();
  };
};

export const ensureClinicAccess = (
  field: 'params' | 'body' | 'query' = 'params', 
  key: string = 'clinicId'
) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const authReq = req as AuthenticatedRequest;
    if (!authReq.user) {
      ApiResponse.unauthorized(res, 'Autenticação obrigatória', 'NOT_AUTHENTICATED');
      return;
    }

    const userClinic = authReq.user.clinicId;
    if (!userClinic) {
      ApiResponse.forbidden(res, 'Usuário não está associado a uma clínica', 'NO_CLINIC_ASSOCIATION');
      return;
    }

    // Super admin can access any clinic
    if (authReq.user.role === 'super_admin') {
      next();
      return;
    }

    const requestData = (req as any)[field];
    const requestedClinic = requestData?.[key];
    
    if (requestedClinic && String(requestedClinic) !== String(userClinic)) {
      ApiResponse.forbidden(res, 'Acesso negado: clínica não autorizada', 'CLINIC_ACCESS_DENIED');
      return;
    }

    next();
  };
};

export const optionalAuth = staffAuth.optionalAuth.bind(staffAuth);

export const ensureOwnership = (
  field: 'params' | 'body' | 'query' = 'params',
  key: string = 'userId'
) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const authReq = req as AuthenticatedRequest;
    if (!authReq.user) {
      ApiResponse.unauthorized(res, 'Autenticação obrigatória', 'NOT_AUTHENTICATED');
      return;
    }

    // Super admin can access any resource
    if (authReq.user.role === 'super_admin') {
      next();
      return;
    }

    const requestData = (req as any)[field];
    const resourceUserId = requestData?.[key];
    
    if (resourceUserId && String(resourceUserId) !== String(authReq.user.id)) {
      ApiResponse.forbidden(res, 'Acesso negado: você só pode acessar seus próprios recursos', 'OWNERSHIP_REQUIRED');
      return;
    }

    next();
  };
};

export const sensitiveOperation = (
  req: Request, 
  res: Response, 
  next: NextFunction
): void => {
  const authReq = req as AuthenticatedRequest;
  if (!authReq.user) {
    ApiResponse.unauthorized(res, 'Autenticação obrigatória', 'NOT_AUTHENTICATED');
    return;
  }

  // Add request metadata for audit logging
  (req as any).auditContext = {
    userId: authReq.user.id,
    userEmail: authReq.user.email,
    userRole: authReq.user.role,
    clinicId: authReq.user.clinicId,
    timestamp: new Date(),
    ip: req.ip || req.connection.remoteAddress,
    userAgent: req.headers['user-agent']
  };

  next();
};