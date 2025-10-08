// backend/src/middleware/permissions.ts
import { Request, Response, NextFunction } from 'express';
import { AuthenticatedRequest } from './auth';
import { Permission, hasPermission, hasAnyPermission } from '../../config/security/permissions';

export const requirePermission = (...permissions: Permission[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const authReq = req as AuthenticatedRequest;
        
        if (!authReq.user) {
            res.status(401).json({
                success: false,
                message: 'Autenticação necessária'
            });
            return;
        }

        const userRole = authReq.user.role;
        const hasRequiredPermission = hasAnyPermission(userRole, permissions);

        if (!hasRequiredPermission) {
            res.status(403).json({
                success: false,
                message: 'Permissão insuficiente'
            });
            return;
        }

        next();
    };
};

export const checkResourceOwnership = (resourceUserIdField: string = 'userId') => {
    return (req: Request, res: Response, next: NextFunction) => {
        const authReq = req as AuthenticatedRequest;
        
        if (!authReq.user) {
            return res.status(401).json({
                success: false,
                message: 'Autenticação necessária'
            });
        }

        const userRole = authReq.user.role;
        
        if (['super_admin', 'admin'].includes(userRole)) {
            return next();
        }

        const resourceUserId = authReq.body[resourceUserIdField] || authReq.params[resourceUserIdField];
        
        if (resourceUserId && resourceUserId !== authReq.user.id) {
            return res.status(403).json({
                success: false,
                message: 'Acesso negado a este recurso'
            });
        }

        next();
    };
};

export const requireClinicAccess = (req: Request, res: Response, next: NextFunction) => {
    const authReq = req as AuthenticatedRequest;
    
    if (!authReq.user) {
        return res.status(401).json({
            success: false,
            message: 'Autenticação necessária'
        });
    }

    if (authReq.user.role === 'super_admin') {
        return next();
    }

    const requestedClinicId = authReq.body.clinic || authReq.params.clinicId || authReq.query.clinicId;
    
    if (requestedClinicId && requestedClinicId !== authReq.user.clinic) {
        return res.status(403).json({
            success: false,
            message: 'Acesso negado a esta clínica'
        });
    }

    next();
};
