import logger from '../utils/logger';
import { Request, Response, NextFunction } from 'express';
import { cacheService } from '../services/cache/cacheService';
import { AuthenticatedRequest } from './auth';

export const cacheMiddleware = (ttl: number = 300) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const authReq = req as AuthenticatedRequest;
    
    if (req.method !== 'GET') {
      return next();
    }

    if (!authReq.user?.clinicId) {
      return next();
    }

    const cacheKey = cacheService.buildKey(
      req.baseUrl,
      req.path,
      authReq.user.clinicId,
      JSON.stringify(req.query)
    );

    try {
      const cachedData = await cacheService.get(cacheKey);
      
      if (cachedData) {
        return res.json({
          ...cachedData,
          meta: {
            ...(cachedData as any).meta,
            cached: true,
            cacheKey
          }
        });
      }

      const originalJson = res.json.bind(res);
      res.json = (body: any) => {
        if (res.statusCode === 200 && body.success !== false) {
          cacheService.set(cacheKey, body, ttl).catch(err => {
            logger.error('Cache set error:', err);
          });
        }
        return originalJson(body);
      };

      next();
    } catch (error) {
      logger.error({ error }, 'Cache middleware error:');
      next();
    }
  };
};

export const invalidateCache = (pattern: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const authReq = req as AuthenticatedRequest;
    
    if (!authReq.user?.clinicId) {
      return next();
    }

    const originalJson = res.json.bind(res);
    res.json = (body: any) => {
      if (res.statusCode >= 200 && res.statusCode < 300) {
        const fullPattern = cacheService.buildKey(pattern, authReq.user!.clinicId || '', '*');
        cacheService.delPattern(fullPattern).catch(err => {
          logger.error('Cache invalidation error:', err);
        });
      }
      return originalJson(body);
    };

    next();
  };
};
