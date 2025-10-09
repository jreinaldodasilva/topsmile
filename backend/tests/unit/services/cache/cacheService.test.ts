import { cacheService } from '../../../../src/services/cache/cacheService';
import redisClient from '../../../../src/config/database/redis';

jest.mock('../../../../src/config/database/redis');

describe('CacheService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('get', () => {
    it('should return parsed data from cache', async () => {
      const mockData = { id: '123', name: 'Test' };
      (redisClient.get as jest.Mock).mockResolvedValue(JSON.stringify(mockData));

      const result = await cacheService.get('test:key');

      expect(result).toEqual(mockData);
      expect(redisClient.get).toHaveBeenCalledWith('test:key');
    });

    it('should return null for cache miss', async () => {
      (redisClient.get as jest.Mock).mockResolvedValue(null);

      const result = await cacheService.get('nonexistent');

      expect(result).toBeNull();
    });
  });

  describe('set', () => {
    it('should set data in cache with TTL', async () => {
      const data = { id: '123', name: 'Test' };
      (redisClient.setex as jest.Mock).mockResolvedValue('OK');

      const result = await cacheService.set('test:key', data, 3600);

      expect(result).toBe(true);
      expect(redisClient.setex).toHaveBeenCalledWith('test:key', 3600, JSON.stringify(data));
    });
  });

  describe('delPattern', () => {
    it('should delete keys matching pattern', async () => {
      const mockKeys = ['test:1', 'test:2'];
      (redisClient.keys as jest.Mock).mockResolvedValue(mockKeys);
      (redisClient.del as jest.Mock).mockResolvedValue(2);

      const result = await cacheService.delPattern('test:*');

      expect(result).toBe(2);
      expect(redisClient.keys).toHaveBeenCalledWith('test:*');
    });
  });

  describe('buildKey', () => {
    it('should build key from parts', () => {
      const key = cacheService.buildKey('provider', 'clinic123', 'provider456');
      expect(key).toBe('provider:clinic123:provider456');
    });
  });

  describe('getProvider', () => {
    it('should get provider from cache', async () => {
      const mockProvider = { id: 'p1', name: 'Dr. Smith' };
      (redisClient.get as jest.Mock).mockResolvedValue(JSON.stringify(mockProvider));

      const result = await cacheService.getProvider('p1', 'clinic123');

      expect(result).toEqual(mockProvider);
    });
  });
});
