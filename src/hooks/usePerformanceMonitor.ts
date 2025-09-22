import { useEffect, useRef, useCallback } from 'react';

interface PerformanceMetric {
  name: string;
  value: number;
  timestamp: number;
  url: string;
  userAgent: string;
}

interface ApiMetric {
  endpoint: string;
  method: string;
  duration: number;
  status: number;
  timestamp: number;
}

class PerformanceMonitor {
  private metrics: PerformanceMetric[] = [];
  private apiMetrics: ApiMetric[] = [];
  private observer: PerformanceObserver | null = null;

  constructor() {
    this.initializeObserver();
  }

  private initializeObserver() {
    if (typeof window !== 'undefined' && 'PerformanceObserver' in window) {
      this.observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          this.recordMetric({
            name: entry.name,
            value: entry.duration || entry.startTime,
            timestamp: Date.now(),
            url: window.location.href,
            userAgent: navigator.userAgent,
          });
        });
      });

      try {
        this.observer.observe({ entryTypes: ['navigation', 'paint', 'largest-contentful-paint'] });
      } catch (error) {
        console.warn('Performance observer not fully supported:', error);
      }
    }
  }

  recordMetric(metric: PerformanceMetric) {
    this.metrics.push(metric);
    
    // Keep only last 100 metrics to prevent memory leaks
    if (this.metrics.length > 100) {
      this.metrics = this.metrics.slice(-100);
    }

    // Send to monitoring service in production
    if (process.env.NODE_ENV === 'production') {
      this.sendToMonitoringService(metric);
    }
  }

  recordApiCall(apiMetric: ApiMetric) {
    this.apiMetrics.push(apiMetric);
    
    if (this.apiMetrics.length > 50) {
      this.apiMetrics = this.apiMetrics.slice(-50);
    }

    if (process.env.NODE_ENV === 'production') {
      this.sendApiMetricToService(apiMetric);
    }
  }

  private async sendToMonitoringService(metric: PerformanceMetric) {
    try {
      await fetch('/api/metrics/performance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(metric),
      });
    } catch (error) {
      // Silently fail to avoid affecting user experience
    }
  }

  private async sendApiMetricToService(metric: ApiMetric) {
    try {
      await fetch('/api/metrics/api', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(metric),
      });
    } catch (error) {
      // Silently fail
    }
  }

  getMetrics() {
    return {
      performance: this.metrics,
      api: this.apiMetrics,
    };
  }

  disconnect() {
    if (this.observer) {
      this.observer.disconnect();
    }
  }
}

const performanceMonitor = new PerformanceMonitor();

export const usePerformanceMonitor = () => {
  const startTimeRef = useRef<number>();

  const startTimer = useCallback((name: string) => {
    startTimeRef.current = performance.now();
    return name;
  }, []);

  const endTimer = useCallback((name: string) => {
    if (startTimeRef.current) {
      const duration = performance.now() - startTimeRef.current;
      performanceMonitor.recordMetric({
        name,
        value: duration,
        timestamp: Date.now(),
        url: window.location.href,
        userAgent: navigator.userAgent,
      });
      startTimeRef.current = undefined;
    }
  }, []);

  const recordApiCall = useCallback((endpoint: string, method: string, duration: number, status: number) => {
    performanceMonitor.recordApiCall({
      endpoint,
      method,
      duration,
      status,
      timestamp: Date.now(),
    });
  }, []);

  const getMetrics = useCallback(() => {
    return performanceMonitor.getMetrics();
  }, []);

  useEffect(() => {
    return () => {
      performanceMonitor.disconnect();
    };
  }, []);

  return {
    startTimer,
    endTimer,
    recordApiCall,
    getMetrics,
  };
};

export default performanceMonitor;