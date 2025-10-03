import fs from 'fs';
import path from 'path';

export interface CoverageData {
  timestamp: string;
  suite: string;
  coverage: {
    lines: { total: number; covered: number; percentage: number };
    functions: { total: number; covered: number; percentage: number };
    branches: { total: number; covered: number; percentage: number };
    statements: { total: number; covered: number; percentage: number };
  };
  files: Record<string, {
    lines: number;
    functions: number;
    branches: number;
    statements: number;
  }>;
}

export class CoverageTracker {
  private static coverageDir = path.join(__dirname, '../../reports/coverage-history');
  private static history: CoverageData[] = [];

  static init() {
    if (!fs.existsSync(this.coverageDir)) {
      fs.mkdirSync(this.coverageDir, { recursive: true });
    }
    this.loadHistory();
  }

  static recordCoverage(data: CoverageData) {
    this.history.push(data);
    this.saveHistory();
  }

  static getCoverageTrend(days: number = 30): {
    dates: string[];
    lines: number[];
    functions: number[];
    branches: number[];
    statements: number[];
  } {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    const recentData = this.history
      .filter(d => new Date(d.timestamp) >= cutoffDate)
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

    return {
      dates: recentData.map(d => d.timestamp.split('T')[0]),
      lines: recentData.map(d => d.coverage.lines.percentage),
      functions: recentData.map(d => d.coverage.functions.percentage),
      branches: recentData.map(d => d.coverage.branches.percentage),
      statements: recentData.map(d => d.coverage.statements.percentage)
    };
  }

  static getUncoveredFiles(): Array<{ file: string; coverage: number }> {
    if (this.history.length === 0) return [];

    const latest = this.history[this.history.length - 1];
    return Object.entries(latest.files)
      .map(([file, coverage]) => ({
        file,
        coverage: Math.min(coverage.lines, coverage.functions, coverage.branches, coverage.statements)
      }))
      .filter(item => item.coverage < 80)
      .sort((a, b) => a.coverage - b.coverage);
  }

  static getCoverageRegression(): Array<{
    file: string;
    previous: number;
    current: number;
    change: number;
  }> {
    if (this.history.length < 2) return [];

    const current = this.history[this.history.length - 1];
    const previous = this.history[this.history.length - 2];

    const regressions: Array<{
      file: string;
      previous: number;
      current: number;
      change: number;
    }> = [];

    Object.keys(current.files).forEach(file => {
      if (previous.files[file]) {
        const currentCov = current.files[file].lines;
        const previousCov = previous.files[file].lines;
        const change = currentCov - previousCov;

        if (change < -5) { // Regression of more than 5%
          regressions.push({
            file,
            previous: previousCov,
            current: currentCov,
            change
          });
        }
      }
    });

    return regressions.sort((a, b) => a.change - b.change);
  }

  static generateCoverageReport(): {
    current: CoverageData | null;
    trend: ReturnType<typeof CoverageTracker.getCoverageTrend>;
    uncoveredFiles: ReturnType<typeof CoverageTracker.getUncoveredFiles>;
    regressions: ReturnType<typeof CoverageTracker.getCoverageRegression>;
    summary: {
      totalFiles: number;
      averageCoverage: number;
      coverageGoalMet: boolean;
      improvementNeeded: string[];
    };
  } {
    const current = this.history.length > 0 ? this.history[this.history.length - 1] : null;
    const trend = this.getCoverageTrend();
    const uncoveredFiles = this.getUncoveredFiles();
    const regressions = this.getCoverageRegression();

    const totalFiles = current ? Object.keys(current.files).length : 0;
    const averageCoverage = current ? current.coverage.lines.percentage : 0;
    const coverageGoalMet = averageCoverage >= 75; // 75% threshold

    const improvementNeeded: string[] = [];
    if (current) {
      if (current.coverage.lines.percentage < 75) improvementNeeded.push('lines');
      if (current.coverage.functions.percentage < 75) improvementNeeded.push('functions');
      if (current.coverage.branches.percentage < 75) improvementNeeded.push('branches');
      if (current.coverage.statements.percentage < 75) improvementNeeded.push('statements');
    }

    return {
      current,
      trend,
      uncoveredFiles,
      regressions,
      summary: {
        totalFiles,
        averageCoverage: Math.round(averageCoverage),
        coverageGoalMet,
        improvementNeeded
      }
    };
  }

  private static loadHistory() {
    const historyFile = path.join(this.coverageDir, 'coverage-history.json');
    if (fs.existsSync(historyFile)) {
      try {
        const data = fs.readFileSync(historyFile, 'utf8');
        this.history = JSON.parse(data);
      } catch (error) {
        console.warn('Failed to load coverage history:', error);
        this.history = [];
      }
    }
  }

  private static saveHistory() {
    const historyFile = path.join(this.coverageDir, 'coverage-history.json');
    // Keep only last 100 entries to prevent file from growing too large
    const recentHistory = this.history.slice(-100);
    fs.writeFileSync(historyFile, JSON.stringify(recentHistory, null, 2));
  }

  static exportReport(filename?: string): string {
    const report = this.generateCoverageReport();
    const filePath = path.join(this.coverageDir, filename || `coverage-report-${Date.now()}.json`);
    fs.writeFileSync(filePath, JSON.stringify(report, null, 2));
    return filePath;
  }
}