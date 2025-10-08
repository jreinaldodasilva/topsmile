import { Request, Response, NextFunction } from 'express';
import { ApiResponse } from '../../utils/responseHelpers';
import { tokenBlacklistService } from '../../services/auth/tokenBlacklistService';

export abstract class BaseAuthMiddleware {
  protected extractToken(req: Request): string | null {
    // Check Authorization header first
    const authHeader = req.headers.authorization;
    if (authHeader) {
      const match = authHeader.match(/^Bearer\s+(.+)$/i);
      if (match && match[1]) return match[1];
    }

    // Check cookies as fallback
    const cookies = (req as any).cookies;
    if (cookies) {
      return this.getCookieTokens(cookies);
    }

    return null;
  }

  protected abstract getCookieTokens(cookies: any): string | null;
  protected abstract verifyToken(token: string): Promise<any>;
  protected abstract attachUserToRequest(req: Request, payload: any): Promise<void>;

  protected handleAuthError(res: Response, error: any): void {
    console.error('Authentication error:', error);
    
    let message = 'Token inválido ou expirado';
    let code = 'INVALID_TOKEN';
    
    if (error instanceof Error) {
      if (error.message.includes('expired')) {
        message = 'Token expirado';
        code = 'TOKEN_EXPIRED';
      } else if (error.message.includes('invalid')) {
        message = 'Token inválido';
        code = 'INVALID_TOKEN';
      } else if (error.message.includes('malformed')) {
        message = 'Token malformado';
        code = 'MALFORMED_TOKEN';
      }
    }

    ApiResponse.error(res, 401, message, code);
  }

  public authenticate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const token = this.extractToken(req);
      
      if (!token) {
        ApiResponse.unauthorized(res, 'Token de acesso obrigatório', 'NO_TOKEN');
        return;
      }

      // Check if token is blacklisted
      const isBlacklisted = await tokenBlacklistService.isBlacklisted(token);
      if (isBlacklisted) {
        ApiResponse.unauthorized(res, 'Token foi revogado', 'TOKEN_REVOKED');
        return;
      }

      const payload = await this.verifyToken(token);
      
      if (!payload) {
        ApiResponse.invalidToken(res, 'Token inválido: formato incorreto', 'INVALID_TOKEN_FORMAT');
        return;
      }

      await this.attachUserToRequest(req, payload);
      next();
    } catch (error) {
      this.handleAuthError(res, error);
    }
  };

  public optionalAuth = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const token = this.extractToken(req);
      
      if (token) {
        try {
          const payload = await this.verifyToken(token);
          if (payload) {
            await this.attachUserToRequest(req, payload);
          }
        } catch (error) {
          console.warn('Optional auth failed:', error instanceof Error ? error.message : 'Unknown error');
        }
      }
      
      next();
    } catch (error) {
      next();
    }
  };
}