// backend/src/routes/mfa.ts
import express, { Request, Response } from 'express';
import { authenticate, AuthenticatedRequest } from '../../middleware/auth';
import { body, validationResult } from 'express-validator';
import { User } from '../../models/User';
import { mfaService } from '../../services/mfaService';

const router: express.Router = express.Router();

router.use(authenticate);

/**
 * @swagger
 * /api/mfa/setup:
 *   post:
 *     summary: Iniciar configuração de MFA
 */
router.post('/setup', async (req: Request, res: Response) => {
    const authReq = req as AuthenticatedRequest;
    
    try {
        const user = await User.findById(authReq.user!.id).select('+mfaSecret');
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Usuário não encontrado'
            });
        }

        if (user.mfaEnabled) {
            return res.status(400).json({
                success: false,
                message: 'MFA já está ativado'
            });
        }

        const secret = mfaService.generateSecret();
        const qrCode = await mfaService.generateQRCode(user.email, secret);

        user.mfaSecret = secret;
        await user.save();

        return res.json({
            success: true,
            message: 'Configuração de MFA iniciada',
            data: {
                secret,
                qrCode
            }
        });
    } catch (error: any) {
        console.error('Error setting up MFA:', error);
        return res.status(400).json({
            success: false,
            message: error.message || 'Erro ao configurar MFA'
        });
    }
});

/**
 * @swagger
 * /api/mfa/verify:
 *   post:
 *     summary: Verificar e ativar MFA
 */
router.post('/verify', body('token').isLength({ min: 6, max: 6 }), async (req: Request, res: Response) => {
    const authReq = req as AuthenticatedRequest;
    
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Token inválido',
                errors: errors.array()
            });
        }

        const user = await User.findById(authReq.user!.id).select('+mfaSecret +mfaBackupCodes');
        
        if (!user || !user.mfaSecret) {
            return res.status(400).json({
                success: false,
                message: 'MFA não configurado'
            });
        }

        const isValid = mfaService.verifyToken(authReq.body.token, user.mfaSecret);
        
        if (!isValid) {
            return res.status(400).json({
                success: false,
                message: 'Token inválido'
            });
        }

        const backupCodes = mfaService.generateBackupCodes();
        const hashedCodes = backupCodes.map(code => mfaService.hashBackupCode(code));

        user.mfaEnabled = true;
        user.mfaBackupCodes = hashedCodes;
        await user.save();

        return res.json({
            success: true,
            message: 'MFA ativado com sucesso',
            data: {
                backupCodes
            }
        });
    } catch (error: any) {
        console.error('Error verifying MFA:', error);
        return res.status(400).json({
            success: false,
            message: error.message || 'Erro ao verificar MFA'
        });
    }
});

/**
 * @swagger
 * /api/mfa/disable:
 *   post:
 *     summary: Desativar MFA
 */
router.post('/disable', body('password').notEmpty(), async (req: Request, res: Response) => {
    const authReq = req as AuthenticatedRequest;
    
    try {
        const user = await User.findById(authReq.user!.id).select('+password +mfaSecret +mfaBackupCodes');
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Usuário não encontrado'
            });
        }

        const isPasswordValid = await (user as any).comparePassword(authReq.body.password);
        
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'Senha incorreta'
            });
        }

        user.mfaEnabled = false;
        user.mfaSecret = undefined;
        user.mfaBackupCodes = undefined;
        await user.save();

        return res.json({
            success: true,
            message: 'MFA desativado com sucesso'
        });
    } catch (error: any) {
        console.error('Error disabling MFA:', error);
        return res.status(400).json({
            success: false,
            message: error.message || 'Erro ao desativar MFA'
        });
    }
});

/**
 * @swagger
 * /api/mfa/backup-codes:
 *   post:
 *     summary: Regenerar códigos de backup
 */
router.post('/backup-codes', body('password').notEmpty(), async (req: Request, res: Response) => {
    const authReq = req as AuthenticatedRequest;
    
    try {
        const user = await User.findById(authReq.user!.id).select('+password +mfaBackupCodes');
        
        if (!user || !user.mfaEnabled) {
            return res.status(400).json({
                success: false,
                message: 'MFA não está ativado'
            });
        }

        const isPasswordValid = await (user as any).comparePassword(authReq.body.password);
        
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'Senha incorreta'
            });
        }

        const backupCodes = mfaService.generateBackupCodes();
        const hashedCodes = backupCodes.map(code => mfaService.hashBackupCode(code));

        user.mfaBackupCodes = hashedCodes;
        await user.save();

        return res.json({
            success: true,
            message: 'Códigos de backup regenerados',
            data: {
                backupCodes
            }
        });
    } catch (error: any) {
        console.error('Error regenerating backup codes:', error);
        return res.status(400).json({
            success: false,
            message: error.message || 'Erro ao regenerar códigos'
        });
    }
});

export default router;
