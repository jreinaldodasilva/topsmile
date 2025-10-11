import logger from '../utils/logger';
// backend/src/middleware/cacheMiddleware.ts
import { Request, Response, NextFunction } from 'express';
import { cacheService } from '../utils/cache';

export interface CacheOptions {
    ttl?: number;
    keyGenerator?: (req: Request) => string;
}

export const cacheMiddleware = (options: CacheOptions = {}) => {
    const { ttl = 300, keyGenerator } = options;

    return async (req: Request, res: Response, next: NextFunction) => {
        // Only cache GET requests
        if (req.method !== 'GET') {
            return next();
        }

        // Generate cache key
        const cacheKey = keyGenerator 
            ? keyGenerator(req)
            : `${req.originalUrl || req.url}`;

        try {
            // Try to get from cache
            const cachedData = await cacheService.get(cacheKey);
            
            if (cachedData) {
                return res.json(cachedData);
            }

            // Store original json method
            const originalJson = res.json.bind(res);

            // Override json method to cache response
            res.json = function(data: any) {
                // Only cache successful responses
                if (res.statusCode >= 200 && res.statusCode < 300) {
                    cacheService.set(cacheKey, data, ttl).catch(err => 
                        logger.error('Failed to cache response:', err)
                    );
                }
                return originalJson(data);
            };

            next();
        } catch (error) {
            logger.error({ error }, 'Cache middleware error:');
            next();
        }
    };
};

// Helper to create cache key from query params
export const queryCacheKey = (baseKey: string) => (req: Request): string => {
    const queryString = new URLSearchParams(req.query as any).toString();
    return queryString ? `${baseKey}:${queryString}` : baseKey;
};
