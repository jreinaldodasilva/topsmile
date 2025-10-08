// backend/src/services/tokenBlacklistService.ts
import { createClient } from 'redis';

class TokenBlacklistService {
  private client: any;
  private isConnected: boolean = false;

  constructor() {
    if (process.env.REDIS_URL) {
      this.initializeRedis();
    }
  }

  private async initializeRedis() {
    try {
      this.client = createClient({
        url: process.env.REDIS_URL
      });

      this.client.on('error', (err: Error) => {
        console.error('Redis Client Error:', err);
        this.isConnected = false;
      });

      this.client.on('connect', () => {
        console.log('✅ Token blacklist service connected to Redis');
        this.isConnected = true;
      });

      await this.client.connect();
    } catch (error) {
      console.warn('Redis not available, token blacklist disabled:', error);
      this.isConnected = false;
    }
  }

  async addToBlacklist(token: string, expiresAt: Date): Promise<void> {
    if (!this.isConnected || !this.client) {
      console.warn('Token blacklist not available (Redis not connected)');
      return;
    }

    try {
      const ttl = Math.floor((expiresAt.getTime() - Date.now()) / 1000);
      if (ttl > 0) {
        await this.client.setEx(`blacklist:${token}`, ttl, '1');
      }
    } catch (error) {
      console.error('Error adding token to blacklist:', error);
    }
  }

  async isBlacklisted(token: string): Promise<boolean> {
    if (!this.isConnected || !this.client) {
      return false;
    }

    try {
      const result = await this.client.get(`blacklist:${token}`);
      return result !== null;
    } catch (error) {
      console.error('Error checking token blacklist:', error);
      return false;
    }
  }

  async removeFromBlacklist(token: string): Promise<void> {
    if (!this.isConnected || !this.client) {
      return;
    }

    try {
      await this.client.del(`blacklist:${token}`);
    } catch (error) {
      console.error('Error removing token from blacklist:', error);
    }
  }
}

export const tokenBlacklistService = new TokenBlacklistService();
