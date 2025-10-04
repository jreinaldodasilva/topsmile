// backend/src/middleware/passwordPolicy.ts
import { Request, Response, NextFunction } from 'express';
import { AuthenticatedRequest } from './auth';
import { User } from '../models/User';

export const checkPasswordExpiry = async (req: Request, res: Response, next: NextFunction) => {
    const authReq = req as AuthenticatedRequest;
    
    if (!authReq.user) {
        return next();
    }

    try {
        const user = await User.findById(authReq.user.id).select('+passwordExpiresAt +forcePasswordChange');
        
        if (!user) {
            return next();
        }

        if (user.forcePasswordChange) {
            return res.status(403).json({
                success: false,
                message: 'Alteração de senha obrigatória',
                requiresPasswordChange: true
            });
        }

        if (user.passwordExpiresAt && new Date() > user.passwordExpiresAt) {
            return res.status(403).json({
                success: false,
                message: 'Senha expirada. Por favor, altere sua senha',
                passwordExpired: true
            });
        }

        next();
    } catch (error) {
        console.error('Error checking password expiry:', error);
        next();
    }
};

export const validatePasswordStrength = (password: string): { valid: boolean; message?: string } => {
    if (password.length < 8) {
        return { valid: false, message: 'Senha deve ter pelo menos 8 caracteres' };
    }

    if (!/(?=.*[A-Z])/.test(password)) {
        return { valid: false, message: 'Senha deve conter pelo menos uma letra maiúscula' };
    }

    if (!/(?=.*[a-z])/.test(password)) {
        return { valid: false, message: 'Senha deve conter pelo menos uma letra minúscula' };
    }

    if (!/(?=.*\d)/.test(password)) {
        return { valid: false, message: 'Senha deve conter pelo menos um número' };
    }

    const commonWeakPasswords = [
        '12345678', 'password', 'password123', 'admin123',
        'qwerty123', '123456789', 'abc123456'
    ];

    if (commonWeakPasswords.includes(password.toLowerCase())) {
        return { valid: false, message: 'Senha muito comum. Escolha uma senha mais segura' };
    }

    return { valid: true };
};
