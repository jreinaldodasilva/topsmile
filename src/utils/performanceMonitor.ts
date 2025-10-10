// src/utils/performanceMonitor.ts
import { onCLS, onFID, onFCP, onLCP, onTTFB, Metric } from 'web-vitals';

const sendToAnalytics = (metric: Metric) => {
    const body = JSON.stringify({
        name: metric.name,
        value: metric.value,
        rating: metric.rating,
        delta: metric.delta,
        id: metric.id
    });

    if (navigator.sendBeacon) {
        navigator.sendBeacon('/api/analytics/vitals', body);
    } else {
        fetch('/api/analytics/vitals', {
            body,
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            keepalive: true
        }).catch(console.error);
    }
};

export const initPerformanceMonitoring = () => {
    onCLS(sendToAnalytics);
    onFID(sendToAnalytics);
    onFCP(sendToAnalytics);
    onLCP(sendToAnalytics);
    onTTFB(sendToAnalytics);
};

export const measureComponentRender = (componentName: string) => {
    const start = performance.now();
    return () => {
        const duration = performance.now() - start;
        if (duration > 16) {
            console.warn(`${componentName} render took ${duration.toFixed(2)}ms`);
        }
    };
};

export const measureApiCall = async <T>(name: string, apiCall: () => Promise<T>): Promise<T> => {
    const start = performance.now();
    try {
        const result = await apiCall();
        const duration = performance.now() - start;
        performance.measure(name, { start, duration });
        return result;
    } catch (error) {
        const duration = performance.now() - start;
        performance.measure(`${name}-error`, { start, duration });
        throw error;
    }
};
