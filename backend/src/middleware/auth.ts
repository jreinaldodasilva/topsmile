// backend/src/middleware/auth.ts
import { Request, Response, NextFunction } from 'express';
import { authService } from '../services/authService';

/**
 * Type exported for route typing convenience.
 * Note: repository already has a types/express.d.ts augmenting Request.user,
 * but we export here a narrow type to use in route handler signatures.
 */
export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email?: string;
    role?: string;
    clinicId?: string;
  };
}

/**
 * Extract Bearer token from Authorization header or from cookies (if present).
 */
const extractToken = (req: Request): string | null => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const match = authHeader.match(/^Bearer\s+(.+)$/i);
    if (match) return match[1];
  }

  // Also allow token present in http-only cookie named 'topsmile_refresh_token' or 'topsmile_access_token'
  // (the exact cookie name is configurable in your front/back integration; check your client).
  if ((req as any).cookies) {
    return (req as any).cookies['topsmile_access_token'] || (req as any).cookies['topsmile_refresh_token'] || null;
  }

  return null;
};

/**
 * Authenticate middleware: verifies access token and attaches `req.user`.
 */
export const authenticate = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const token = extractToken(req);
    if (!token) {
      return res.status(401).json({ success: false, message: 'Unauthorized: no token provided' });
    }

    const payload = await authService.verifyAccessToken(token);
    // payload should include userId/email/role/clinicId
    const userId = (payload as any).userId || (payload as any).id || undefined;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized: invalid token payload' });
    }

    req.user = {
      id: String(userId),
      email: (payload as any).email,
      role: (payload as any).role,
      clinicId: (payload as any).clinicId,
    };
    return next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Unauthorized: token invalid or expired' });
  }
};

/**
 * Role-based authorization middleware factory:
 * authorize('admin', 'manager') -> middleware that allows only those roles
 */
export const authorize = (...allowedRoles: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const role = req.user?.role;
    if (!role || (allowedRoles.length > 0 && !allowedRoles.includes(role))) {
      return res.status(403).json({ success: false, message: 'Forbidden: insufficient role' });
    }
    return next();
  };
};

/**
 * Simple clinic access enforcement middleware.
 * Checks that the authenticated user's clinicId matches the requested clinicId param or body.
 */
export const ensureClinicAccess = (field: 'params' | 'body' = 'params', key: string = 'clinicId') => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const userClinic = req.user?.clinicId;
    if (!userClinic) {
      return res.status(403).json({ success: false, message: 'Forbidden: no clinic association' });
    }
    const value = (req as any)[field]?.[key];
    if (value && String(value) !== String(userClinic)) {
      return res.status(403).json({ success: false, message: 'Forbidden: clinic mismatch' });
    }
    return next();
  };
};
