import fs from 'fs';
import path from 'path';

export interface PerformanceMetric {
  testName: string;
  suite: string;
  duration: number;
  memoryUsage: {
    heapUsed: number;
    heapTotal: number;
    external: number;
  };
  timestamp: string;
  threshold?: number;
  passed: boolean;
}

export class PerformanceMonitor {
  private static metricsDir = path.join(__dirname, '../../reports/performance');
  private static metrics: PerformanceMetric[] = [];

  static init() {
    if (!fs.existsSync(this.metricsDir)) {
      fs.mkdirSync(this.metricsDir, { recursive: true });
    }
  }

  static startTest(testName: string, suite: string): { 
    startTime: number; 
    initialMemory: NodeJS.MemoryUsage 
  } {
    return {
      startTime: Date.now(),
      initialMemory: process.memoryUsage()
    };
  }

  static endTest(
    testName: string,
    suite: string,
    startData: { startTime: number; initialMemory: NodeJS.MemoryUsage },
    threshold?: number
  ): PerformanceMetric {
    const endTime = Date.now();
    const endMemory = process.memoryUsage();
    const duration = endTime - startData.startTime;

    const metric: PerformanceMetric = {
      testName,
      suite,
      duration,
      memoryUsage: {
        heapUsed: Math.round((endMemory.heapUsed - startData.initialMemory.heapUsed) / 1024 / 1024),
        heapTotal: Math.round(endMemory.heapTotal / 1024 / 1024),
        external: Math.round(endMemory.external / 1024 / 1024)
      },
      timestamp: new Date().toISOString(),
      threshold,
      passed: threshold ? duration < threshold : true
    };

    this.metrics.push(metric);
    return metric;
  }

  static getSlowTests(threshold: number = 1000): PerformanceMetric[] {
    return this.metrics
      .filter(m => m.duration > threshold)
      .sort((a, b) => b.duration - a.duration);
  }

  static getMemoryLeaks(threshold: number = 50): PerformanceMetric[] {
    return this.metrics
      .filter(m => m.memoryUsage.heapUsed > threshold)
      .sort((a, b) => b.memoryUsage.heapUsed - a.memoryUsage.heapUsed);
  }

  static getTrendData(testName: string): PerformanceMetric[] {
    return this.metrics
      .filter(m => m.testName === testName)
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  }

  static generatePerformanceReport(): {
    summary: {
      totalTests: number;
      averageDuration: number;
      averageMemoryUsage: number;
      slowTestsCount: number;
      memoryLeaksCount: number;
    };
    slowTests: PerformanceMetric[];
    memoryLeaks: PerformanceMetric[];
    trends: Record<string, { avgDuration: number; trend: 'improving' | 'degrading' | 'stable' }>;
  } {
    const totalTests = this.metrics.length;
    const averageDuration = totalTests > 0 
      ? this.metrics.reduce((sum, m) => sum + m.duration, 0) / totalTests 
      : 0;
    const averageMemoryUsage = totalTests > 0
      ? this.metrics.reduce((sum, m) => sum + m.memoryUsage.heapUsed, 0) / totalTests
      : 0;

    const slowTests = this.getSlowTests();
    const memoryLeaks = this.getMemoryLeaks();

    // Calculate trends for unique test names
    const uniqueTests = [...new Set(this.metrics.map(m => m.testName))];
    const trends: Record<string, { avgDuration: number; trend: 'improving' | 'degrading' | 'stable' }> = {};

    uniqueTests.forEach(testName => {
      const testMetrics = this.getTrendData(testName);
      if (testMetrics.length >= 2) {
        const recent = testMetrics.slice(-5);
        const older = testMetrics.slice(-10, -5);
        
        const recentAvg = recent.reduce((sum, m) => sum + m.duration, 0) / recent.length;
        const olderAvg = older.length > 0 
          ? older.reduce((sum, m) => sum + m.duration, 0) / older.length 
          : recentAvg;

        let trend: 'improving' | 'degrading' | 'stable' = 'stable';
        const change = ((recentAvg - olderAvg) / olderAvg) * 100;
        
        if (change > 10) trend = 'degrading';
        else if (change < -10) trend = 'improving';

        trends[testName] = { avgDuration: recentAvg, trend };
      }
    });

    return {
      summary: {
        totalTests,
        averageDuration: Math.round(averageDuration),
        averageMemoryUsage: Math.round(averageMemoryUsage),
        slowTestsCount: slowTests.length,
        memoryLeaksCount: memoryLeaks.length
      },
      slowTests: slowTests.slice(0, 10),
      memoryLeaks: memoryLeaks.slice(0, 10),
      trends
    };
  }

  static exportMetrics(filename?: string): string {
    const report = this.generatePerformanceReport();
    const filePath = path.join(this.metricsDir, filename || `performance-${Date.now()}.json`);
    fs.writeFileSync(filePath, JSON.stringify(report, null, 2));
    return filePath;
  }

  static clear() {
    this.metrics = [];
  }
}