// backend/src/services/tokenBlacklistService.ts
import Redis from 'ioredis';

class TokenBlacklistService {
  private redis: Redis | null = null;
  private isConnected: boolean = false;
  private inMemoryBlacklist: Set<string> = new Set();

  constructor() {
    if (process.env.REDIS_URL) {
      this.initializeRedis();
    } else {
      console.warn('⚠️  REDIS_URL not set, using in-memory token blacklist (not suitable for production)');
    }
  }

  private async initializeRedis() {
    try {
      this.redis = new Redis(process.env.REDIS_URL!, {
        retryStrategy: (times) => {
          if (times > 3) return null;
          return Math.min(times * 100, 3000);
        },
        lazyConnect: true
      });

      this.redis.on('error', (err) => {
        console.error('Redis error:', err.message);
        this.isConnected = false;
      });

      this.redis.on('connect', () => {
        console.log('✅ Token blacklist connected to Redis');
        this.isConnected = true;
      });

      await this.redis.connect();
    } catch (error) {
      console.warn('Redis connection failed, using in-memory blacklist');
      this.isConnected = false;
    }
  }

  async addToBlacklist(token: string, expiresAt: Date): Promise<void> {
    if (this.isConnected && this.redis) {
      try {
        const ttl = Math.floor((expiresAt.getTime() - Date.now()) / 1000);
        if (ttl > 0) {
          await this.redis.setex(`blacklist:${token}`, ttl, '1');
        }
      } catch (error) {
        console.error('Error adding to Redis blacklist:', error);
        this.inMemoryBlacklist.add(token);
      }
    } else {
      this.inMemoryBlacklist.add(token);
      setTimeout(() => this.inMemoryBlacklist.delete(token), expiresAt.getTime() - Date.now());
    }
  }

  async isBlacklisted(token: string): Promise<boolean> {
    if (this.isConnected && this.redis) {
      try {
        const result = await this.redis.get(`blacklist:${token}`);
        return result === '1';
      } catch (error) {
        console.error('Error checking Redis blacklist:', error);
        return this.inMemoryBlacklist.has(token);
      }
    }
    return this.inMemoryBlacklist.has(token);
  }

  async disconnect(): Promise<void> {
    if (this.redis) {
      await this.redis.quit();
    }
  }
}

export const tokenBlacklistService = new TokenBlacklistService();
