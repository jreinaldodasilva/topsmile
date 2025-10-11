// backend/src/utils/cache.ts
import Redis from 'ioredis';
import logger from '../logger';

class CacheService {
    private client: Redis | null = null;
    private isEnabled: boolean = false;

    constructor() {
        this.initialize();
    }

    private initialize() {
        if (process.env.NODE_ENV === 'test') {
            this.isEnabled = false;
            return;
        }

        try {
            const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
            this.client = new Redis(redisUrl, {
                maxRetriesPerRequest: 3,
                retryStrategy: (times) => {
                    if (times > 3) return null;
                    return Math.min(times * 100, 2000);
                }
            });

            this.client.on('error', (err) => {
                logger.error({ err }, 'Redis error');
                this.isEnabled = false;
            });

            this.client.on('connect', () => {
                this.isEnabled = true;
            });
        } catch (error) {
            logger.error({ error }, 'Failed to initialize Redis');
            this.isEnabled = false;
        }
    }

    async get<T>(key: string): Promise<T | null> {
        if (!this.isEnabled || !this.client) return null;

        try {
            const data = await this.client.get(key);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            logger.error({ error, key }, 'Cache get error');
            return null;
        }
    }

    async set(key: string, value: any, ttlSeconds: number = 300): Promise<boolean> {
        if (!this.isEnabled || !this.client) return false;

        try {
            await this.client.setex(key, ttlSeconds, JSON.stringify(value));
            return true;
        } catch (error) {
            logger.error({ error, key }, 'Cache set error');
            return false;
        }
    }

    async del(key: string): Promise<boolean> {
        if (!this.isEnabled || !this.client) return false;

        try {
            await this.client.del(key);
            return true;
        } catch (error) {
            logger.error({ error, key }, 'Cache delete error');
            return false;
        }
    }

    async delPattern(pattern: string): Promise<boolean> {
        if (!this.isEnabled || !this.client) return false;

        try {
            const keys = await this.client.keys(pattern);
            if (keys.length > 0) {
                await this.client.del(...keys);
            }
            return true;
        } catch (error) {
            logger.error({ error, pattern }, 'Cache delete pattern error');
            return false;
        }
    }

    async exists(key: string): Promise<boolean> {
        if (!this.isEnabled || !this.client) return false;

        try {
            const result = await this.client.exists(key);
            return result === 1;
        } catch (error) {
            logger.error({ error, key }, 'Cache exists error');
            return false;
        }
    }

    async ttl(key: string): Promise<number> {
        if (!this.isEnabled || !this.client) return -1;

        try {
            return await this.client.ttl(key);
        } catch (error) {
            logger.error({ error, key }, 'Cache ttl error');
            return -1;
        }
    }

    async flush(): Promise<boolean> {
        if (!this.isEnabled || !this.client) return false;

        try {
            await this.client.flushdb();
            return true;
        } catch (error) {
            logger.error({ error }, 'Cache flush error');
            return false;
        }
    }

    disconnect(): void {
        if (this.client) {
            this.client.disconnect();
            this.client = null;
            this.isEnabled = false;
        }
    }
}

export const cacheService = new CacheService();

// Cache key builders
export const CacheKeys = {
    provider: (id: string) => `provider:${id}`,
    providerAvailability: (id: string, date: string) => `provider:${id}:availability:${date}`,
    appointmentType: (id: string) => `appointment-type:${id}`,
    appointmentTypes: (clinicId: string) => `appointment-types:${clinicId}`,
    patient: (id: string) => `patient:${id}`,
    appointments: (clinicId: string, start: string, end: string) => `appointments:${clinicId}:${start}:${end}`,
    clinicStats: (clinicId: string) => `clinic:${clinicId}:stats`
};
