import fs from 'fs';
import path from 'path';

export interface TestResult {
  testName: string;
  status: 'passed' | 'failed' | 'skipped';
  duration: number;
  error?: string;
  suite: string;
  timestamp: string;
}

export interface TestSuiteMetrics {
  suiteName: string;
  totalTests: number;
  passed: number;
  failed: number;
  skipped: number;
  duration: number;
  coverage?: number;
  timestamp: string;
}

export class TestAnalytics {
  private static resultsDir = path.join(__dirname, '../../reports/analytics');
  private static results: TestResult[] = [];

  static init() {
    if (!fs.existsSync(this.resultsDir)) {
      fs.mkdirSync(this.resultsDir, { recursive: true });
    }
  }

  static recordTest(result: TestResult) {
    this.results.push(result);
  }

  static recordSuite(metrics: TestSuiteMetrics) {
    const filePath = path.join(this.resultsDir, `suite-${Date.now()}.json`);
    fs.writeFileSync(filePath, JSON.stringify(metrics, null, 2));
  }

  static getFailureRate(suite?: string): number {
    const filteredResults = suite 
      ? this.results.filter(r => r.suite === suite)
      : this.results;
    
    if (filteredResults.length === 0) return 0;
    
    const failed = filteredResults.filter(r => r.status === 'failed').length;
    return (failed / filteredResults.length) * 100;
  }

  static getAverageDuration(suite?: string): number {
    const filteredResults = suite 
      ? this.results.filter(r => r.suite === suite)
      : this.results;
    
    if (filteredResults.length === 0) return 0;
    
    const totalDuration = filteredResults.reduce((sum, r) => sum + r.duration, 0);
    return totalDuration / filteredResults.length;
  }

  static getFlakyTests(threshold: number = 3): string[] {
    const testFailures = new Map<string, number>();
    
    this.results.forEach(result => {
      if (result.status === 'failed') {
        const count = testFailures.get(result.testName) || 0;
        testFailures.set(result.testName, count + 1);
      }
    });

    return Array.from(testFailures.entries())
      .filter(([_, failures]) => failures >= threshold)
      .map(([testName]) => testName);
  }

  static generateReport(): {
    summary: {
      totalTests: number;
      passed: number;
      failed: number;
      skipped: number;
      failureRate: number;
      averageDuration: number;
    };
    flakyTests: string[];
    slowestTests: Array<{ name: string; duration: number }>;
  } {
    const totalTests = this.results.length;
    const passed = this.results.filter(r => r.status === 'passed').length;
    const failed = this.results.filter(r => r.status === 'failed').length;
    const skipped = this.results.filter(r => r.status === 'skipped').length;

    const slowestTests = this.results
      .sort((a, b) => b.duration - a.duration)
      .slice(0, 10)
      .map(r => ({ name: r.testName, duration: r.duration }));

    return {
      summary: {
        totalTests,
        passed,
        failed,
        skipped,
        failureRate: this.getFailureRate(),
        averageDuration: this.getAverageDuration()
      },
      flakyTests: this.getFlakyTests(),
      slowestTests
    };
  }

  static exportResults(filename?: string) {
    const report = this.generateReport();
    const filePath = path.join(this.resultsDir, filename || `test-analytics-${Date.now()}.json`);
    fs.writeFileSync(filePath, JSON.stringify(report, null, 2));
    return filePath;
  }

  static clear() {
    this.results = [];
  }
}