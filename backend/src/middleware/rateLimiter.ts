import rateLimit from 'express-rate-limit';

export const patientAuthLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // 5 attempts per window
    message: { 
        success: false, 
        message: 'Muitas tentativas de autenticação. Tente novamente em 15 minutos.' 
    },
    standardHeaders: true,
    legacyHeaders: false
});

export const passwordResetLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 3, // 3 password reset attempts per hour
    message: { 
        success: false, 
        message: 'Muitas solicitações de redefinição. Tente novamente em 1 hora.' 
    }
});
