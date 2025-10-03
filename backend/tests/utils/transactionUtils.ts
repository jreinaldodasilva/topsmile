import mongoose from 'mongoose';

/**
 * Transaction testing utilities
 */

export const withTransaction = async <T>(
  operation: (session: mongoose.ClientSession) => Promise<T>
): Promise<T> => {
  const session = await mongoose.startSession();
  
  try {
    return await session.withTransaction(async () => {
      return await operation(session);
    });
  } finally {
    await session.endSession();
  }
};

export const expectTransactionRollback = async (
  operation: () => Promise<void>,
  verifyRollback: () => Promise<void>
): Promise<void> => {
  let errorThrown = false;
  
  try {
    await operation();
  } catch (error) {
    errorThrown = true;
  }
  
  expect(errorThrown).toBe(true);
  await verifyRollback();
};

export const simulateTransactionFailure = async (
  session: mongoose.ClientSession,
  afterOperations: () => Promise<void>
): Promise<void> => {
  await afterOperations();
  throw new Error('Simulated transaction failure');
};

export const createConcurrentTransactions = <T>(
  operation: () => Promise<T>,
  count: number
): Promise<PromiseSettledResult<T>[]> => {
  const operations = Array(count).fill(null).map(() => operation());
  return Promise.allSettled(operations);
};

export const verifyTransactionIsolation = async (
  setup: () => Promise<any>,
  concurrentOperations: Array<() => Promise<any>>,
  verify: (results: any[]) => void
): Promise<void> => {
  await setup();
  
  const results = await Promise.allSettled(
    concurrentOperations.map(op => op())
  );
  
  const successfulResults = results
    .filter(r => r.status === 'fulfilled')
    .map(r => (r as PromiseFulfilledResult<any>).value);
  
  verify(successfulResults);
};