/**
 * Performance testing utilities
 */

export interface PerformanceMetrics {
  duration: number;
  memoryUsed: number;
  operationsPerSecond: number;
}

export const measurePerformance = async <T>(
  operation: () => Promise<T>,
  iterations: number = 1
): Promise<PerformanceMetrics & { result: T }> => {
  const initialMemory = process.memoryUsage().heapUsed;
  const start = Date.now();
  
  let result: T;
  for (let i = 0; i < iterations; i++) {
    result = await operation();
  }
  
  const duration = Date.now() - start;
  const finalMemory = process.memoryUsage().heapUsed;
  const memoryUsed = Math.round((finalMemory - initialMemory) / 1024 / 1024);
  const operationsPerSecond = Math.round((iterations / duration) * 1000);
  
  return {
    result: result!,
    duration,
    memoryUsed,
    operationsPerSecond
  };
};

export const expectPerformance = (
  metrics: PerformanceMetrics,
  thresholds: {
    maxDuration?: number;
    maxMemory?: number;
    minOpsPerSecond?: number;
  }
) => {
  if (thresholds.maxDuration) {
    expect(metrics.duration).toBeLessThan(thresholds.maxDuration);
  }
  
  if (thresholds.maxMemory) {
    expect(metrics.memoryUsed).toBeLessThan(thresholds.maxMemory);
  }
  
  if (thresholds.minOpsPerSecond) {
    expect(metrics.operationsPerSecond).toBeGreaterThan(thresholds.minOpsPerSecond);
  }
};

export const runConcurrentOperations = async <T>(
  operation: () => Promise<T>,
  concurrency: number
): Promise<T[]> => {
  const promises = Array(concurrency).fill(null).map(() => operation());
  return Promise.all(promises);
};

export const benchmarkOperation = async <T>(
  name: string,
  operation: () => Promise<T>,
  iterations: number = 100
): Promise<void> => {
  console.log(`\n📊 Benchmarking: ${name}`);
  
  const metrics = await measurePerformance(operation, iterations);
  
  console.log(`   Duration: ${metrics.duration}ms`);
  console.log(`   Memory: ${metrics.memoryUsed}MB`);
  console.log(`   Ops/sec: ${metrics.operationsPerSecond}`);
};