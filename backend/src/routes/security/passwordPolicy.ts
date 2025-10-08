// backend/src/routes/passwordPolicy.ts
import express, { Request, Response } from 'express';
import { authenticate, AuthenticatedRequest } from '../../middleware/auth/auth';
import { body, validationResult } from 'express-validator';
import { validatePasswordStrength } from '../../middleware/security/passwordPolicy';
import type { User as IUser } from '@topsmile/types';
import { User } from '../../models/User';

const router: express.Router = express.Router();

router.use(authenticate);

/**
 * @swagger
 * /api/password-policy/change:
 *   post:
 *     summary: Alterar senha
 */
router.post('/change',
    body('currentPassword').notEmpty().withMessage('Senha atual é obrigatória'),
    body('newPassword').notEmpty().withMessage('Nova senha é obrigatória'),
    async (req: Request, res: Response) => {
    const authReq = req as AuthenticatedRequest;
    
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Dados inválidos',
                errors: errors.array()
            });
        }

        const strengthCheck = validatePasswordStrength(authReq.body.newPassword);
        if (!strengthCheck.valid) {
            return res.status(400).json({
                success: false,
                message: strengthCheck.message
            });
        }

        const user = await User.findById(authReq.user!.id).select('+password +passwordHistory');
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Usuário não encontrado'
            });
        }

        const isCurrentPasswordValid = await (user as any).comparePassword(authReq.body.currentPassword);
        
        if (!isCurrentPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'Senha atual incorreta'
            });
        }

        user.password = authReq.body.newPassword;
        await user.save();

        return res.json({
            success: true,
            message: 'Senha alterada com sucesso'
        });
    } catch (error: any) {
        console.error('Error changing password:', error);
        return res.status(400).json({
            success: false,
            message: error.message || 'Erro ao alterar senha'
        });
    }
});

/**
 * @swagger
 * /api/password-policy/status:
 *   get:
 *     summary: Verificar status da senha
 */
router.get('/status', async (req: Request, res: Response) => {
    const authReq = req as AuthenticatedRequest;
    
    try {
        const user = await User.findById(authReq.user!.id).select('+passwordExpiresAt +passwordChangedAt +forcePasswordChange');
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Usuário não encontrado'
            });
        }

        const now = new Date();
        const daysUntilExpiry = user.passwordExpiresAt 
            ? Math.ceil((user.passwordExpiresAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
            : null;

        return res.json({
            success: true,
            data: {
                passwordChangedAt: user.passwordChangedAt,
                passwordExpiresAt: user.passwordExpiresAt,
                daysUntilExpiry,
                isExpired: user.passwordExpiresAt ? now > user.passwordExpiresAt : false,
                forcePasswordChange: user.forcePasswordChange || false
            }
        });
    } catch (error: any) {
        console.error('Error getting password status:', error);
        return res.status(400).json({
            success: false,
            message: error.message || 'Erro ao verificar status'
        });
    }
});

export default router;
