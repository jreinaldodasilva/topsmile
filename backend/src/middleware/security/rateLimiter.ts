import logger from '../../utils/logger';
// backend/src/middleware/rateLimiter.ts
import rateLimit from 'express-rate-limit';
import { Request, Response } from 'express';

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
        keyGenerator,
        handler: (req: Request, res: Response) => {
            logger.warn(`Rate limit exceeded: ${req.method} ${req.path} from ${req.ip}`);
            res.status(429).json({ success: false, message });
        }
    });
};

// Pre-configured rate limiters
export const rateLimiters = {
    auth: createRateLimiter(
        15 * 60 * 1000,
        10,
        'Muitas tentativas de autenticação. Tente novamente em 15 minutos.',
        (req: Request) => req.body?.email ? `auth_${req.body.email}` : `auth_ip_${req.ip}`
    ),

    contact: createRateLimiter(
        15 * 60 * 1000,
        5,
        'Muitos formulários enviados. Tente novamente em 15 minutos.'
    ),

    passwordReset: createRateLimiter(
        60 * 60 * 1000,
        3,
        'Muitas solicitações de redefinição de senha. Tente novamente em 1 hora.'
    ),

    api: createRateLimiter(
        15 * 60 * 1000,
        process.env.NODE_ENV === 'production' ? 100 : 1000,
        'Muitas requisições. Tente novamente em 15 minutos.'
    )
};

export const patientAuthLimiter = rateLimiters.auth;
export const passwordResetLimiter = rateLimiters.passwordReset;
