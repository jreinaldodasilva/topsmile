// backend/tests/unit/cache.test.ts
import { CacheService } from '../../src/utils/cache/cache';

jest.mock('ioredis');

describe('CacheService', () => {
  let cacheService: CacheService;

  beforeEach(() => {
    cacheService = new CacheService();
  });

  describe('get', () => {
    it('returns cached value', async () => {
      const mockGet = jest.fn().mockResolvedValue(JSON.stringify({ data: 'test' }));
      (cacheService as any).client.get = mockGet;

      const result = await cacheService.get('test-key');
      
      expect(mockGet).toHaveBeenCalledWith('test-key');
      expect(result).toEqual({ data: 'test' });
    });

    it('returns null for cache miss', async () => {
      const mockGet = jest.fn().mockResolvedValue(null);
      (cacheService as any).client.get = mockGet;

      const result = await cacheService.get('missing-key');
      
      expect(result).toBeNull();
    });
  });

  describe('set', () => {
    it('sets value with TTL', async () => {
      const mockSet = jest.fn().mockResolvedValue('OK');
      (cacheService as any).client.setex = mockSet;

      await cacheService.set('test-key', { data: 'test' }, 3600);
      
      expect(mockSet).toHaveBeenCalledWith(
        'test-key',
        3600,
        JSON.stringify({ data: 'test' })
      );
    });
  });

  describe('del', () => {
    it('deletes key', async () => {
      const mockDel = jest.fn().mockResolvedValue(1);
      (cacheService as any).client.del = mockDel;

      await cacheService.del('test-key');
      
      expect(mockDel).toHaveBeenCalledWith('test-key');
    });
  });

  describe('delPattern', () => {
    it('deletes keys matching pattern', async () => {
      const mockKeys = jest.fn().mockResolvedValue(['key1', 'key2']);
      const mockDel = jest.fn().mockResolvedValue(2);
      (cacheService as any).client.keys = mockKeys;
      (cacheService as any).client.del = mockDel;

      await cacheService.delPattern('test:*');
      
      expect(mockKeys).toHaveBeenCalledWith('test:*');
      expect(mockDel).toHaveBeenCalledWith('key1', 'key2');
    });
  });
});
