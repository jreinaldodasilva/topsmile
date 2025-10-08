// backend/src/services/auditService.ts
import { Request } from 'express';
import { AuthenticatedRequest } from '../../middleware/auth/auth';
import type { AuditLog as IAuditLog } from '@topsmile/types';
import { AuditLog } from '../../models/AuditLog';

class AuditService {
    async log(data: {
        user?: string;
        action: string;
        resource: string;
        resourceId?: string;
        method: string;
        path: string;
        ipAddress: string;
        userAgent?: string;
        statusCode?: number;
        changes?: { before?: any; after?: any };
        metadata?: Record<string, any>;
        clinic?: string;
    }): Promise<void> {
        try {
            await AuditLog.create(data);
        } catch (error) {
            console.error('Error creating audit log:', error);
        }
    }

    async logFromRequest(req: Request, action: string, resource: string, options: {
        resourceId?: string;
        statusCode?: number;
        changes?: { before?: any; after?: any };
        metadata?: Record<string, any>;
    } = {}): Promise<void> {
        const authReq = req as AuthenticatedRequest;
        
        await this.log({
            user: authReq.user?.id,
            action,
            resource,
            resourceId: options.resourceId,
            method: req.method,
            path: req.path,
            ipAddress: req.ip || 'unknown',
            userAgent: req.get('user-agent'),
            statusCode: options.statusCode,
            changes: options.changes,
            metadata: options.metadata,
            clinic: authReq.user?.clinic
        });
    }

    async getRecentLogs(userId: string, limit: number = 50) {
        return AuditLog.find({ user: userId })
            .sort({ createdAt: -1 })
            .limit(limit)
            .lean();
    }

    async getLoginAttempts(ipAddress: string, minutes: number = 15) {
        const since = new Date();
        since.setMinutes(since.getMinutes() - minutes);

        return AuditLog.countDocuments({
            action: { $in: ['login', 'failed_login'] },
            ipAddress,
            createdAt: { $gte: since }
        });
    }

    async getFailedLoginAttempts(userId: string, minutes: number = 15) {
        const since = new Date();
        since.setMinutes(since.getMinutes() - minutes);

        return AuditLog.countDocuments({
            user: userId,
            action: 'failed_login',
            createdAt: { $gte: since }
        });
    }
}

export const auditService = new AuditService();
