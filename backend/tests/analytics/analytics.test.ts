import { TestAnalytics } from './test-reporter';
import { PerformanceMonitor } from './performance-monitor';
import { CoverageTracker } from './coverage-tracker';

describe('Test Analytics System', () => {
  beforeEach(() => {
    TestAnalytics.clear();
    PerformanceMonitor.clear();
  });

  describe('TestAnalytics', () => {
    it('should record and analyze test results', () => {
      TestAnalytics.recordTest({
        testName: 'should create patient',
        status: 'passed',
        duration: 150,
        suite: 'PatientService',
        timestamp: new Date().toISOString()
      });

      TestAnalytics.recordTest({
        testName: 'should validate email',
        status: 'failed',
        duration: 75,
        error: 'Invalid email format',
        suite: 'ValidationService',
        timestamp: new Date().toISOString()
      });

      const report = TestAnalytics.generateReport();
      
      expect(report.summary.totalTests).toBe(2);
      expect(report.summary.passed).toBe(1);
      expect(report.summary.failed).toBe(1);
      expect(report.summary.failureRate).toBe(50);
    });

    it('should detect flaky tests', () => {
      // Record multiple failures for the same test
      for (let i = 0; i < 4; i++) {
        TestAnalytics.recordTest({
          testName: 'flaky test',
          status: 'failed',
          duration: 100,
          suite: 'FlakyService',
          timestamp: new Date().toISOString()
        });
      }

      const flakyTests = TestAnalytics.getFlakyTests(3);
      expect(flakyTests).toContain('flaky test');
    });

    it('should calculate average duration by suite', () => {
      TestAnalytics.recordTest({
        testName: 'test1',
        status: 'passed',
        duration: 100,
        suite: 'Suite1',
        timestamp: new Date().toISOString()
      });

      TestAnalytics.recordTest({
        testName: 'test2',
        status: 'passed',
        duration: 200,
        suite: 'Suite1',
        timestamp: new Date().toISOString()
      });

      const avgDuration = TestAnalytics.getAverageDuration('Suite1');
      expect(avgDuration).toBe(150);
    });
  });

  describe('PerformanceMonitor', () => {
    it('should track test performance metrics', () => {
      const testName = 'performance test';
      const suite = 'PerformanceTests';
      
      const startData = PerformanceMonitor.startTest(testName, suite);
      
      // Simulate test execution
      const buffer = Buffer.alloc(1024 * 1024); // Allocate 1MB
      
      const metric = PerformanceMonitor.endTest(testName, suite, startData, 1000);
      
      expect(metric.testName).toBe(testName);
      expect(metric.suite).toBe(suite);
      expect(metric.duration).toBeGreaterThan(0);
      expect(metric.memoryUsage.heapUsed).toBeGreaterThan(0);
    });

    it('should identify slow tests', () => {
      const startData = PerformanceMonitor.startTest('slow test', 'SlowSuite');
      
      // Simulate slow test
      const start = Date.now();
      while (Date.now() - start < 50) {
        // Busy wait to simulate slow operation
      }
      
      PerformanceMonitor.endTest('slow test', 'SlowSuite', startData);
      
      const slowTests = PerformanceMonitor.getSlowTests(10);
      expect(slowTests.length).toBeGreaterThan(0);
      expect(slowTests[0].testName).toBe('slow test');
    });

    it('should generate performance report', () => {
      const startData = PerformanceMonitor.startTest('test', 'Suite');
      PerformanceMonitor.endTest('test', 'Suite', startData);
      
      const report = PerformanceMonitor.generatePerformanceReport();
      
      expect(report.summary.totalTests).toBe(1);
      expect(report.summary.averageDuration).toBeGreaterThan(0);
      expect(report.slowTests).toBeDefined();
      expect(report.memoryLeaks).toBeDefined();
      expect(report.trends).toBeDefined();
    });
  });

  describe('CoverageTracker', () => {
    it('should track coverage data', () => {
      const coverageData = {
        timestamp: new Date().toISOString(),
        suite: 'TestSuite',
        coverage: {
          lines: { total: 100, covered: 85, percentage: 85 },
          functions: { total: 20, covered: 18, percentage: 90 },
          branches: { total: 50, covered: 40, percentage: 80 },
          statements: { total: 120, covered: 100, percentage: 83.33 }
        },
        files: {
          'src/services/patientService.ts': {
            lines: 90,
            functions: 95,
            branches: 85,
            statements: 88
          }
        }
      };

      CoverageTracker.recordCoverage(coverageData);
      
      const report = CoverageTracker.generateCoverageReport();
      
      expect(report.current).toBeDefined();
      expect(report.summary.totalFiles).toBe(1);
      expect(report.summary.averageCoverage).toBe(85);
    });

    it('should identify uncovered files', () => {
      const coverageData = {
        timestamp: new Date().toISOString(),
        suite: 'TestSuite',
        coverage: {
          lines: { total: 100, covered: 60, percentage: 60 },
          functions: { total: 20, covered: 15, percentage: 75 },
          branches: { total: 50, covered: 30, percentage: 60 },
          statements: { total: 120, covered: 80, percentage: 66.67 }
        },
        files: {
          'src/services/uncoveredService.ts': {
            lines: 50,
            functions: 60,
            branches: 40,
            statements: 55
          }
        }
      };

      CoverageTracker.recordCoverage(coverageData);
      
      const uncoveredFiles = CoverageTracker.getUncoveredFiles();
      
      expect(uncoveredFiles.length).toBeGreaterThan(0);
      expect(uncoveredFiles[0].file).toBe('src/services/uncoveredService.ts');
      expect(uncoveredFiles[0].coverage).toBeLessThan(80);
    });
  });

  describe('Integration', () => {
    it('should work together to provide comprehensive analytics', () => {
      // Record test result
      TestAnalytics.recordTest({
        testName: 'integration test',
        status: 'passed',
        duration: 250,
        suite: 'IntegrationSuite',
        timestamp: new Date().toISOString()
      });

      // Record performance
      const startData = PerformanceMonitor.startTest('integration test', 'IntegrationSuite');
      PerformanceMonitor.endTest('integration test', 'IntegrationSuite', startData);

      // Record coverage
      CoverageTracker.recordCoverage({
        timestamp: new Date().toISOString(),
        suite: 'IntegrationSuite',
        coverage: {
          lines: { total: 100, covered: 90, percentage: 90 },
          functions: { total: 20, covered: 19, percentage: 95 },
          branches: { total: 50, covered: 45, percentage: 90 },
          statements: { total: 120, covered: 110, percentage: 91.67 }
        },
        files: {}
      });

      // Generate reports
      const testReport = TestAnalytics.generateReport();
      const perfReport = PerformanceMonitor.generatePerformanceReport();
      const coverageReport = CoverageTracker.generateCoverageReport();

      expect(testReport.summary.totalTests).toBe(1);
      expect(perfReport.summary.totalTests).toBe(1);
      expect(coverageReport.summary.averageCoverage).toBe(90);
    });
  });
});