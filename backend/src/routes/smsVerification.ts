// backend/src/routes/smsVerification.ts
import express, { Request, Response } from 'express';
import { authenticate, AuthenticatedRequest } from '../middleware/auth';
import { body, validationResult } from 'express-validator';
import { User } from '../models/User';
import { smsService } from '../services/smsService';

const router: express.Router = express.Router();

router.use(authenticate);

/**
 * @swagger
 * /api/sms-verification/send:
 *   post:
 *     summary: Enviar código de verificação por SMS
 */
router.post('/send', body('phone').isMobilePhone('pt-BR'), async (req: Request, res: Response) => {
    const authReq = req as AuthenticatedRequest;
    
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Número de telefone inválido',
                errors: errors.array()
            });
        }

        const code = smsService.generateVerificationCode();
        const sent = await smsService.sendVerificationSMS(authReq.body.phone, code);

        if (!sent) {
            return res.status(500).json({
                success: false,
                message: 'Erro ao enviar SMS'
            });
        }

        smsService.storeVerificationCode(authReq.user!.id!, code);

        return res.json({
            success: true,
            message: 'Código de verificação enviado'
        });
    } catch (error: any) {
        console.error('Error sending verification SMS:', error);
        return res.status(400).json({
            success: false,
            message: error.message || 'Erro ao enviar código'
        });
    }
});

/**
 * @swagger
 * /api/sms-verification/verify:
 *   post:
 *     summary: Verificar código SMS
 */
router.post('/verify', 
    body('phone').isMobilePhone('pt-BR'),
    body('code').isLength({ min: 6, max: 6 }),
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

        const isValid = smsService.verifyCode(authReq.user!.id!, authReq.body.code);

        if (!isValid) {
            return res.status(400).json({
                success: false,
                message: 'Código inválido ou expirado'
            });
        }

        const user = await User.findById(authReq.user!.id);
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Usuário não encontrado'
            });
        }

        user.phone = authReq.body.phone;
        user.phoneVerified = true;
        await user.save();

        return res.json({
            success: true,
            message: 'Telefone verificado com sucesso'
        });
    } catch (error: any) {
        console.error('Error verifying SMS code:', error);
        return res.status(400).json({
            success: false,
            message: error.message || 'Erro ao verificar código'
        });
    }
});

export default router;
