import { RedisClientType } from 'redis';

export class MockRedisClient {
  private store = new Map<string, { value: string; expiry?: number }>();
  private connected = true;

  async connect(): Promise<void> {
    this.connected = true;
  }

  async disconnect(): Promise<void> {
    this.connected = false;
  }

  async quit(): Promise<void> {
    this.connected = false;
  }

  async get(key: string): Promise<string | null> {
    if (!this.connected) throw new Error('Redis client not connected');
    
    const item = this.store.get(key);
    if (!item) return null;
    
    if (item.expiry && Date.now() > item.expiry) {
      this.store.delete(key);
      return null;
    }
    
    return item.value;
  }

  async set(key: string, value: string, options?: { EX?: number }): Promise<string> {
    if (!this.connected) throw new Error('Redis client not connected');
    
    const expiry = options?.EX ? Date.now() + options.EX * 1000 : undefined;
    this.store.set(key, { value, expiry });
    return 'OK';
  }

  async del(key: string): Promise<number> {
    if (!this.connected) throw new Error('Redis client not connected');
    
    const existed = this.store.has(key);
    this.store.delete(key);
    return existed ? 1 : 0;
  }

  async exists(key: string): Promise<number> {
    if (!this.connected) throw new Error('Redis client not connected');
    return this.store.has(key) ? 1 : 0;
  }

  async flushAll(): Promise<string> {
    if (!this.connected) throw new Error('Redis client not connected');
    this.store.clear();
    return 'OK';
  }

  async expire(key: string, seconds: number): Promise<number> {
    if (!this.connected) throw new Error('Redis client not connected');
    
    const item = this.store.get(key);
    if (!item) return 0;
    
    this.store.set(key, { ...item, expiry: Date.now() + seconds * 1000 });
    return 1;
  }

  // Test utilities
  clear(): void {
    this.store.clear();
  }

  simulateDisconnection(): void {
    this.connected = false;
  }

  simulateReconnection(): void {
    this.connected = true;
  }

  getStoreSize(): number {
    return this.store.size;
  }
}

// Mock factory for tests
export const createMockRedisClient = (): MockRedisClient => {
  return new MockRedisClient();
};

// Jest mock setup
export const setupRedisMock = (): MockRedisClient => {
  return createMockRedisClient();
};