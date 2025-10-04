// backend/src/middleware/auditLogger.ts
import { Request, Response, NextFunction } from 'express';
import { AuthenticatedRequest } from './auth';
import { auditService } from '../services/auditService';

const getResourceFromPath = (path: string): string => {
    const parts = path.split('/').filter(Boolean);
    if (parts.length >= 2 && parts[0] === 'api') {
        return parts[1];
    }
    return 'unknown';
};

const getActionFromMethod = (method: string): string => {
    const actionMap: Record<string, string> = {
        'GET': 'read',
        'POST': 'create',
        'PUT': 'update',
        'PATCH': 'update',
        'DELETE': 'delete'
    };
    return actionMap[method] || 'unknown';
};

export const auditLogger = (req: Request, res: Response, next: NextFunction) => {
    const authReq = req as AuthenticatedRequest;
    
    const originalSend = res.send;
    
    res.send = function(data: any) {
        res.send = originalSend;
        
        const resource = getResourceFromPath(authReq.path);
        const action = getActionFromMethod(authReq.method);
        
        if (authReq.user && !authReq.path.includes('/health')) {
            auditService.logFromRequest(authReq, action, resource, {
                statusCode: res.statusCode
            }).catch(err => console.error('Audit logging error:', err));
        }
        
        return res.send(data);
    };
    
    next();
};
