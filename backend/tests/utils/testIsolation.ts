import mongoose from 'mongoose';

/**
 * Test isolation utilities for parallel execution
 */

export const createIsolatedCollection = (baseName: string): string => {
  const workerId = process.env.JEST_WORKER_ID || '1';
  const timestamp = Date.now();
  return `${baseName}_worker_${workerId}_${timestamp}`;
};

export const withIsolatedDatabase = async <T>(
  operation: () => Promise<T>
): Promise<T> => {
  const originalCollections = Object.keys(mongoose.connection.collections);
  
  try {
    const result = await operation();
    return result;
  } finally {
    // Clean up any new collections created during the operation
    const currentCollections = Object.keys(mongoose.connection.collections);
    const newCollections = currentCollections.filter(
      name => !originalCollections.includes(name)
    );
    
    await Promise.all(
      newCollections.map(name => 
        mongoose.connection.collections[name].drop().catch(() => {})
      )
    );
  }
};

export const ensureTestIsolation = async (): Promise<void> => {
  if (mongoose.connection.readyState === 1) {
    const collections = Object.values(mongoose.connection.collections);
    await Promise.all(
      collections.map(collection => 
        collection.deleteMany({}).catch(() => {})
      )
    );
  }
};

export const getWorkerInfo = () => ({
  workerId: process.env.JEST_WORKER_ID || '1',
  isParallel: !!process.env.JEST_WORKER_ID,
  maxWorkers: process.env.NODE_ENV === 'test' ? 4 : 2
});