// backend/src/middleware/auth.ts
import { Request, Response, NextFunction } from 'express';
import { authService } from '../services/authService';
import { User } from '../models/User';

export interface AuthenticatedRequest extends Request {
    user?: {
        id: string;
        email: string;
        role: string;
        clinicId?: string;
    };
}

// Middleware to verify JWT token
export const authenticate = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const token = extractToken(req);

        if (!token) {
            res.status(401).json({
                success: false,
                message: 'Token de acesso obrigatório'
            });
            return;
        }

        // Verify token
        const decoded = authService.verifyToken(token);

        // Get user from database to ensure they still exist and are active
        const user = await User.findById(decoded.userId);
        if (!user || !user.isActive) {
            res.status(401).json({
                success: false,
                message: 'Token inválido'
            });
            return;
        }

        // Add user info to request
        req.user = {
            id: decoded.userId,
            email: decoded.email,
            role: decoded.role,
            clinicId: decoded.clinicId
        };

        return next();
    } catch (error) {
            res.status(401).json({
            success: false,
            message: 'Token inválido'
        });
        return;
    }
};

// Middleware to check user roles
export const authorize = (...roles: string[]) => {
    return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        if (!req.user) {
            res.status(401).json({
                success: false,
                message: 'Acesso negado'
            });
            return;
        }

        if (!roles.includes(req.user.role)) {
            res.status(403).json({
                success: false,
                message: 'Permissão insuficiente'
            });
            return;
        }

        next();
    };
};

// Middleware to ensure user can only access their clinic's data
export const ensureClinicAccess = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
        return res.status(401).json({
            success: false,
            message: 'Acesso negado'
        });
    }

    // Super admins can access everything
    if (req.user.role === 'super_admin') {
        return next();
    }

    // Other users can only access their clinic's data
    const clinicIdFromParams = req.params.clinicId;
    const clinicIdFromQuery = req.query.clinicId as string;
    const targetClinicId = clinicIdFromParams || clinicIdFromQuery;

    if (targetClinicId && targetClinicId !== req.user.clinicId) {
        return res.status(403).json({
            success: false,
            message: 'Acesso negado aos dados desta clínica'
        });
    }

    next();
};

// Extract token from Authorization header
const extractToken = (req: Request): string | null => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return null;
    }

    // Check for Bearer token
    const match = authHeader.match(/^Bearer\s+(.+)$/);
    return match ? match[1] : null;
};