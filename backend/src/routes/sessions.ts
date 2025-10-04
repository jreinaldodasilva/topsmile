// backend/src/routes/sessions.ts
import express, { Request, Response } from 'express';
import { authenticate, AuthenticatedRequest } from '../middleware/auth';
import { param, validationResult } from 'express-validator';
import { sessionService } from '../services/sessionService';
import { Session } from '../models/Session';

const router: express.Router = express.Router();

router.use(authenticate);

/**
 * @swagger
 * /api/sessions:
 *   get:
 *     summary: Listar sessões ativas do usuário
 */
router.get('/', async (req: Request, res: Response) => {
    const authReq = req as AuthenticatedRequest;
    
    try {
        const sessions = await sessionService.getUserSessions(authReq.user!.id!);

        return res.json({
            success: true,
            data: sessions
        });
    } catch (error: any) {
        console.error('Error fetching sessions:', error);
        return res.status(400).json({
            success: false,
            message: error.message || 'Erro ao buscar sessões'
        });
    }
});

/**
 * @swagger
 * /api/sessions/:sessionId:
 *   delete:
 *     summary: Revogar sessão específica
 */
router.delete('/:sessionId', param('sessionId').isMongoId(), async (req: Request, res: Response) => {
    const authReq = req as AuthenticatedRequest;
    
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'ID de sessão inválido',
                errors: errors.array()
            });
        }

        const session = await Session.findOne({
            _id: authReq.params.sessionId,
            user: authReq.user!.id
        });

        if (!session) {
            return res.status(404).json({
                success: false,
                message: 'Sessão não encontrada'
            });
        }

        await sessionService.revokeSession(session.refreshToken);

        return res.json({
            success: true,
            message: 'Sessão revogada com sucesso'
        });
    } catch (error: any) {
        console.error('Error revoking session:', error);
        return res.status(400).json({
            success: false,
            message: error.message || 'Erro ao revogar sessão'
        });
    }
});

/**
 * @swagger
 * /api/sessions/revoke-all:
 *   post:
 *     summary: Revogar todas as sessões exceto a atual
 */
router.post('/revoke-all', async (req: Request, res: Response) => {
    const authReq = req as AuthenticatedRequest;
    
    try {
        const currentToken = authReq.headers.authorization?.split(' ')[1];
        
        const count = await sessionService.revokeAllUserSessions(authReq.user!.id!, currentToken);

        return res.json({
            success: true,
            message: `${count} sessão(ões) revogada(s) com sucesso`
        });
    } catch (error: any) {
        console.error('Error revoking all sessions:', error);
        return res.status(400).json({
            success: false,
            message: error.message || 'Erro ao revogar sessões'
        });
    }
});

export default router;
