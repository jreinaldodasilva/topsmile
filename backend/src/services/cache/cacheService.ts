import logger from '../../utils/logger';
import redisClient from '../../config/database/redis';

class CacheService {
  private readonly DEFAULT_TTL = 3600;
  private readonly PROVIDER_TTL = 7200;
  private readonly SETTINGS_TTL = 86400;

  async get<T>(key: string): Promise<T | null> {
    try {
      const data = await redisClient.get(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      logger.error({ error }, `Cache get error for key ${key}:`);
      return null;
    }
  }

  async set(key: string, value: any, ttl: number = this.DEFAULT_TTL): Promise<boolean> {
    try {
      await redisClient.setex(key, ttl, JSON.stringify(value));
      return true;
    } catch (error) {
      logger.error({ error }, `Cache set error for key ${key}:`);
      return false;
    }
  }

  async del(key: string): Promise<boolean> {
    try {
      await redisClient.del(key);
      return true;
    } catch (error) {
      logger.error({ error }, `Cache delete error for key ${key}:`);
      return false;
    }
  }

  async delPattern(pattern: string): Promise<number> {
    try {
      const keys = await redisClient.keys(pattern);
      if (keys.length === 0) return 0;
      return await redisClient.del(...keys);
    } catch (error) {
      logger.error({ error }, `Cache delete pattern error for ${pattern}:`);
      return 0;
    }
  }

  buildKey(...parts: string[]): string {
    return parts.filter(Boolean).join(':');
  }

  async getProvider(providerId: string, clinicId: string): Promise<any | null> {
    const key = this.buildKey('provider', clinicId, providerId);
    return await this.get(key);
  }

  async setProvider(providerId: string, clinicId: string, data: any): Promise<boolean> {
    const key = this.buildKey('provider', clinicId, providerId);
    return await this.set(key, data, this.PROVIDER_TTL);
  }

  async invalidateProvider(providerId: string, clinicId: string): Promise<boolean> {
    const key = this.buildKey('provider', clinicId, providerId);
    return await this.del(key);
  }

  async invalidateAllProviders(clinicId: string): Promise<number> {
    const pattern = this.buildKey('provider', clinicId, '*');
    return await this.delPattern(pattern);
  }

  async getSettings(clinicId: string): Promise<any | null> {
    const key = this.buildKey('settings', clinicId);
    return await this.get(key);
  }

  async setSettings(clinicId: string, data: any): Promise<boolean> {
    const key = this.buildKey('settings', clinicId);
    return await this.set(key, data, this.SETTINGS_TTL);
  }

  async invalidateSettings(clinicId: string): Promise<boolean> {
    const key = this.buildKey('settings', clinicId);
    return await this.del(key);
  }

  async invalidateAppointments(clinicId: string): Promise<number> {
    const pattern = this.buildKey('appointments', clinicId, '*');
    return await this.delPattern(pattern);
  }

  async invalidatePatient(patientId: string, clinicId: string): Promise<boolean> {
    const key = this.buildKey('patient', clinicId, patientId);
    return await this.del(key);
  }
}

export const cacheService = new CacheService();
