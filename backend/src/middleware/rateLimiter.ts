// backend/src/middleware/rateLimiter.ts
import rateLimit from 'express-rate-limit';
import { Request, Response } from 'express';
import { CONSTANTS } from '../config/constants';
import { AuthenticatedRequest } from './auth/auth';

export const createRateLimiter = (
  windowMs: number,
  max: number,
  message: string,
  keyGenerator?: (req: Request) => string
) => {
  return rateLimit({
    windowMs,
    max,
    message: { success: false, message },
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: keyGenerator || ((req: Request) => req.ip || 'unknown'),
    handler: (req, res) => {
      console.warn(`Rate limit exceeded: ${req.method} ${req.path} from ${req.ip}`);
      res.status(CONSTANTS.HTTP_STATUS.TOO_MANY_REQUESTS).json({
        success: false,
        message,
      });
    },
  });
};

// Tiered rate limiting by user role
export const createTieredRateLimiter = (limits: Record<string, number>, windowMs: number) => {
  return rateLimit({
    windowMs,
    max: (req: Request) => {
      const authReq = req as AuthenticatedRequest;
      const role = authReq.user?.role || 'guest';
      return limits[role] || limits.guest || 100;
    },
    keyGenerator: (req: Request) => {
      const authReq = req as AuthenticatedRequest;
      return authReq.user?.id || req.ip || 'unknown';
    },
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
      const authReq = req as AuthenticatedRequest;
      console.warn(`Rate limit exceeded for user ${authReq.user?.id || req.ip}`);
      res.status(CONSTANTS.HTTP_STATUS.TOO_MANY_REQUESTS).json({
        success: false,
        message: CONSTANTS.ERRORS.RATE_LIMIT_EXCEEDED,
      });
    },
  });
};

// Specific rate limiters
export const apiLimiter = createTieredRateLimiter(
  {
    super_admin: 10000,
    admin: 5000,
    manager: 2000,
    dentist: 1000,
    assistant: 500,
    patient: 200,
    guest: 100,
  },
  CONSTANTS.RATE_LIMIT.WINDOW_MS
);

export const authLimiter = createRateLimiter(
  CONSTANTS.RATE_LIMIT.WINDOW_MS,
  process.env.NODE_ENV === 'production' 
    ? CONSTANTS.RATE_LIMIT.AUTH_MAX 
    : CONSTANTS.RATE_LIMIT.AUTH_MAX_DEV,
  'Muitas tentativas de autenticação. Tente novamente em 15 minutos.',
  (req: Request) => {
    const email = req.body?.email;
    return email ? `auth_${email}` : `auth_ip_${req.ip}`;
  }
);

export const passwordResetLimiter = createRateLimiter(
  CONSTANTS.RATE_LIMIT.PASSWORD_RESET_WINDOW,
  CONSTANTS.RATE_LIMIT.PASSWORD_RESET_MAX,
  'Muitas solicitações de redefinição de senha. Tente novamente em 1 hora.',
  (req: Request) => {
    const authReq = req as AuthenticatedRequest;
    return authReq.user?.id || req.ip || 'unknown';
  }
);

export const contactLimiter = createRateLimiter(
  CONSTANTS.RATE_LIMIT.WINDOW_MS,
  CONSTANTS.RATE_LIMIT.CONTACT_MAX,
  'Muitos formulários enviados. Tente novamente em 15 minutos.'
);
