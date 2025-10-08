// backend/src/routes/roleManagement.ts
import express, { Request, Response } from 'express';
import { authenticate, authorize, AuthenticatedRequest } from '../../middleware/auth/auth';
import { body, param, validationResult } from 'express-validator';
import { rolePermissions } from '../../config/security/permissions';
import { auditService } from '../../services/admin/auditService';
import type { User as IUser } from '@topsmile/types';
import { User } from '../../models/User';

const router: express.Router = express.Router();

router.use(authenticate);
router.use(authorize('super_admin', 'admin'));

/**
 * @swagger
 * /api/role-management/assign:
 *   post:
 *     summary: Atribuir role a um usuário
 */
router.post('/assign',
    body('userId').isMongoId().withMessage('ID do usuário inválido'),
    body('role').isIn(['admin', 'manager', 'dentist', 'hygienist', 'receptionist', 'lab_technician', 'assistant']),
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

        if (authReq.user!.role === 'admin' && req.body.role === 'super_admin') {
            return res.status(403).json({
                success: false,
                message: 'Apenas super_admin pode atribuir role de super_admin'
            });
        }

        const user = await User.findById(authReq.body.userId);
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Usuário não encontrado'
            });
        }

        if (authReq.user!.role === 'admin' && user.clinic?.toString() !== authReq.user!.clinic) {
            return res.status(403).json({
                success: false,
                message: 'Você só pode gerenciar usuários da sua clínica'
            });
        }

        const oldRole = user.role;
        user.role = authReq.body.role;
        await user.save();

        await auditService.logFromRequest(authReq, 'update', 'user', {
            resourceId: user.id,
            changes: {
                before: { role: oldRole },
                after: { role: user.role }
            }
        });

        return res.json({
            success: true,
            message: 'Role atribuída com sucesso',
            data: {
                userId: user.id,
                name: user.name,
                role: user.role
            }
        });
    } catch (error: any) {
        console.error('Error assigning role:', error);
        return res.status(400).json({
            success: false,
            message: error.message || 'Erro ao atribuir role'
        });
    }
});

/**
 * @swagger
 * /api/role-management/users/:role:
 *   get:
 *     summary: Listar usuários por role
 */
router.get('/users/:role', param('role').isString(), async (req: Request, res: Response) => {
    const authReq = req as AuthenticatedRequest;
    
    try {
        const filter: any = { role: authReq.params.role };
        
        if (authReq.user!.role === 'admin') {
            filter.clinic = authReq.user!.clinic;
        }

        const users = await User.find(filter)
            .select('name email role isActive lastLogin')
            .sort({ name: 1 })
            .lean();

        return res.json({
            success: true,
            data: users
        });
    } catch (error: any) {
        console.error('Error fetching users by role:', error);
        return res.status(400).json({
            success: false,
            message: error.message || 'Erro ao buscar usuários'
        });
    }
});

/**
 * @swagger
 * /api/role-management/user/:userId/permissions:
 *   get:
 *     summary: Obter permissões de um usuário
 */
router.get('/user/:userId/permissions', param('userId').isMongoId(), async (req: Request, res: Response) => {
    const authReq = req as AuthenticatedRequest;
    
    try {
        const user = await User.findById(authReq.params.userId).select('name email role');
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Usuário não encontrado'
            });
        }

        if (authReq.user!.role === 'admin' && user.clinic?.toString() !== authReq.user!.clinic) {
            return res.status(403).json({
                success: false,
                message: 'Acesso negado'
            });
        }

        const permissions = rolePermissions[user.role] || [];

        return res.json({
            success: true,
            data: {
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role
                },
                permissions
            }
        });
    } catch (error: any) {
        console.error('Error fetching user permissions:', error);
        return res.status(400).json({
            success: false,
            message: error.message || 'Erro ao buscar permissões'
        });
    }
});

/**
 * @swagger
 * /api/role-management/stats:
 *   get:
 *     summary: Estatísticas de roles
 */
router.get('/stats', async (req: Request, res: Response) => {
    const authReq = req as AuthenticatedRequest;
    
    try {
        const filter: any = {};
        
        if (authReq.user!.role === 'admin') {
            filter.clinic = authReq.user!.clinic;
        }

        const stats = await User.aggregate([
            { $match: filter },
            {
                $group: {
                    _id: '$role',
                    count: { $sum: 1 },
                    active: {
                        $sum: { $cond: [{ $eq: ['$isActive', true] }, 1, 0] }
                    }
                }
            },
            { $sort: { count: -1 } }
        ]);

        return res.json({
            success: true,
            data: stats
        });
    } catch (error: any) {
        console.error('Error fetching role stats:', error);
        return res.status(400).json({
            success: false,
            message: error.message || 'Erro ao buscar estatísticas'
        });
    }
});

export default router;
