// backend/src/routes/auditLogs.ts
import express, { Request, Response } from 'express';
import { authenticate, authorize, AuthenticatedRequest } from '../../middleware/auth/auth';
import { query, param, validationResult } from 'express-validator';
import type { AuditLog as IAuditLog } from '@topsmile/types';
import { AuditLog } from '../../models/AuditLog';

const router: express.Router = express.Router();

router.use(authenticate);

/**
 * @swagger
 * /api/audit-logs:
 *   get:
 *     summary: Listar logs de auditoria
 */
router.get('/', 
    authorize('admin', 'super_admin'),
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 100 }),
    query('action').optional().isString(),
    query('resource').optional().isString(),
    query('userId').optional().isMongoId(),
    async (req: Request, res: Response) => {
    const authReq = req as AuthenticatedRequest;
    
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Parâmetros inválidos',
                errors: errors.array()
            });
        }

        const page = parseInt(authReq.query.page as string) || 1;
        const limit = parseInt(authReq.query.limit as string) || 50;
        const skip = (page - 1) * limit;

        const filter: any = {};
        
        if (authReq.user!.role !== 'super_admin') {
            filter.clinic = authReq.user!.clinic;
        }
        
        if (authReq.query.action) filter.action = authReq.query.action;
        if (authReq.query.resource) filter.resource = authReq.query.resource;
        if (authReq.query.userId) filter.user = authReq.query.userId;

        const [logs, total] = await Promise.all([
            AuditLog.find(filter)
                .populate('user', 'name email')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean(),
            AuditLog.countDocuments(filter)
        ]);

        return res.json({
            success: true,
            data: {
                logs,
                pagination: {
                    page,
                    limit,
                    total,
                    pages: Math.ceil(total / limit)
                }
            }
        });
    } catch (error: any) {
        console.error('Error fetching audit logs:', error);
        return res.status(400).json({
            success: false,
            message: error.message || 'Erro ao buscar logs'
        });
    }
});

/**
 * @swagger
 * /api/audit-logs/user/:userId:
 *   get:
 *     summary: Listar logs de um usuário
 */
router.get('/user/:userId', 
    authorize('admin', 'super_admin'),
    param('userId').isMongoId(),
    async (req: Request, res: Response) => {
    const authReq = req as AuthenticatedRequest;
    
    try {
        const logs = await AuditLog.find({ user: authReq.params.userId })
            .sort({ createdAt: -1 })
            .limit(100)
            .lean();

        return res.json({
            success: true,
            data: logs
        });
    } catch (error: any) {
        console.error('Error fetching user audit logs:', error);
        return res.status(400).json({
            success: false,
            message: error.message || 'Erro ao buscar logs'
        });
    }
});

/**
 * @swagger
 * /api/audit-logs/resource/:resource/:resourceId:
 *   get:
 *     summary: Listar logs de um recurso
 */
router.get('/resource/:resource/:resourceId',
    authorize('admin', 'super_admin'),
    async (req: Request, res: Response) => {
    const authReq = req as AuthenticatedRequest;
    
    try {
        const logs = await AuditLog.find({
            resource: authReq.params.resource,
            resourceId: authReq.params.resourceId
        })
            .populate('user', 'name email')
            .sort({ createdAt: -1 })
            .limit(50)
            .lean();

        return res.json({
            success: true,
            data: logs
        });
    } catch (error: any) {
        console.error('Error fetching resource audit logs:', error);
        return res.status(400).json({
            success: false,
            message: error.message || 'Erro ao buscar logs'
        });
    }
});

export default router;
