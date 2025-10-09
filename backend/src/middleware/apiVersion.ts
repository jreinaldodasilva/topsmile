// backend/src/middleware/apiVersion.ts
import { Request, Response, NextFunction } from 'express';

export interface VersionedRequest extends Request {
    apiVersion: string;
}

export const apiVersionMiddleware = (req: Request, res: Response, next: NextFunction) => {
    try {
        const versionHeader = req.headers['api-version'] as string;
        const versionPath = req.path.match(/^\/api\/v(\d+)\//)?.[1];
        
        const version = versionPath || versionHeader || 'v1';
        (req as VersionedRequest).apiVersion = version.replace(/[^a-z0-9]/gi, '');
        
        next();
    } catch (error) {
        next(error);
    }
};

export const requireVersion = (version: string) => {
    return (req: Request, res: Response, next: NextFunction): void => {
        try {
            const reqVersion = (req as VersionedRequest).apiVersion;
            const sanitizedVersion = version.replace(/[^a-z0-9]/gi, '');
            
            if (reqVersion !== sanitizedVersion) {
                res.status(400).json({
                    success: false,
                    message: 'Versão da API incompatível',
                    requiredVersion: sanitizedVersion
                });
                return;
            }
            
            next();
        } catch (error) {
            next(error);
        }
    };
};

export const deprecatedVersion = (version: string, sunsetDate: string) => {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            const reqVersion = (req as VersionedRequest).apiVersion;
            const sanitizedVersion = version.replace(/[^a-z0-9]/gi, '');
            
            if (reqVersion === sanitizedVersion) {
                res.setHeader('Deprecation', 'true');
                res.setHeader('Sunset', sunsetDate);
                res.setHeader('Link', '</api-docs>; rel="deprecation"');
            }
            
            next();
        } catch (error) {
            next(error);
        }
    };
};
