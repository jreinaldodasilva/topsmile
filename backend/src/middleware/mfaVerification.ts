// backend/src/middleware/mfaVerification.ts
import { Request, Response, NextFunction } from 'express';
import { AuthenticatedRequest } from './auth';
import { User } from '../models/User';
import { mfaService } from '../services/mfaService';

export const requireMFA = async (req: Request, res: Response, next: NextFunction) => {
    const authReq = req as AuthenticatedRequest;
    
    try {
        const user = await User.findById(authReq.user!.id).select('+mfaEnabled +mfaSecret +mfaBackupCodes');
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Usuário não encontrado'
            });
        }

        if (!user.mfaEnabled) {
            return next();
        }

        const mfaToken = authReq.headers['x-mfa-token'] as string;
        
        if (!mfaToken) {
            return res.status(403).json({
                success: false,
                message: 'Token MFA obrigatório',
                requiresMFA: true
            });
        }

        let isValid = false;

        if (user.mfaSecret) {
            isValid = mfaService.verifyToken(mfaToken, user.mfaSecret);
        }

        if (!isValid && user.mfaBackupCodes && user.mfaBackupCodes.length > 0) {
            const backupResult = mfaService.verifyBackupCode(mfaToken, user.mfaBackupCodes);
            
            if (backupResult.valid && backupResult.remainingCode) {
                isValid = true;
                user.mfaBackupCodes = user.mfaBackupCodes.filter(code => code !== backupResult.remainingCode);
                await user.save();
            }
        }

        if (!isValid) {
            return res.status(401).json({
                success: false,
                message: 'Token MFA inválido'
            });
        }

        next();
    } catch (error: any) {
        console.error('MFA verification error:', error);
        return res.status(500).json({
            success: false,
            message: 'Erro ao verificar MFA'
        });
    }
};
