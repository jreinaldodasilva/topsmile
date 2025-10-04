// backend/src/routes/permissions.ts
import express, { Request, Response } from 'express';
import { authenticate, AuthenticatedRequest } from '../middleware/auth';
import { rolePermissions } from '../config/permissions';

const router: express.Router = express.Router();

router.use(authenticate);

/**
 * @swagger
 * /api/permissions/my-permissions:
 *   get:
 *     summary: Obter permissões do usuário atual
 */
router.get('/my-permissions', (req: Request, res: Response) => {
    const authReq = req as AuthenticatedRequest;
    
    const permissions = rolePermissions[authReq.user!.role] || [];

    return res.json({
        success: true,
        data: {
            role: authReq.user!.role,
            permissions
        }
    });
});

/**
 * @swagger
 * /api/permissions/roles:
 *   get:
 *     summary: Listar todas as roles e suas permissões
 */
router.get('/roles', (req: Request, res: Response) => {
    return res.json({
        success: true,
        data: rolePermissions
    });
});

export default router;
