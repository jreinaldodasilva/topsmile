# Performance Monitoring Guide

## Overview

Performance monitoring tracks Web Vitals and custom metrics to ensure optimal user experience.

## Web Vitals Tracked

### Core Web Vitals
- **LCP (Largest Contentful Paint)**: < 2.5s (good), < 4s (needs improvement)
- **FID (First Input Delay)**: < 100ms (good), < 300ms (needs improvement)
- **CLS (Cumulative Layout Shift)**: < 0.1 (good), < 0.25 (needs improvement)

### Additional Metrics
- **FCP (First Contentful Paint)**: < 1.8s (good)
- **TTFB (Time to First Byte)**: < 600ms (good)

## Implementation

### Frontend Monitoring

```tsx
// Automatic in production
import { initPerformanceMonitoring } from './utils/performanceMonitor';

if (process.env.NODE_ENV === 'production') {
  initPerformanceMonitoring();
}
```

### Component Monitoring

```tsx
import { usePerformanceMonitor } from './hooks/usePerformanceMonitor';

const MyComponent = () => {
  usePerformanceMonitor('MyComponent');
  // Component code
};
```

### API Call Monitoring

```tsx
import { measureApiCall } from './utils/performanceMonitor';

const fetchData = () => measureApiCall('fetchPatients', async () => {
  return await apiService.get('/patients');
});
```

## Backend Endpoint

Web Vitals are sent to:
```
POST /api/analytics/vitals
```

Payload:
```json
{
  "name": "LCP",
  "value": 1234.5,
  "rating": "good",
  "delta": 100.2,
  "id": "v3-1234567890"
}
```

## Monitoring in Development

Component render times logged to console:
```
MyComponent render took 18.45ms
```

Component lifecycle stats on unmount:
```
MyComponent stats: { renders: 5, lifetime: "2345.67ms" }
```

## Performance Budgets

| Metric | Target | Warning | Critical |
|--------|--------|---------|----------|
| LCP | < 2.5s | 2.5-4s | > 4s |
| FID | < 100ms | 100-300ms | > 300ms |
| CLS | < 0.1 | 0.1-0.25 | > 0.25 |
| FCP | < 1.8s | 1.8-3s | > 3s |
| TTFB | < 600ms | 600-1s | > 1s |
| Component Render | < 16ms | 16-50ms | > 50ms |
| API Call | < 500ms | 500-1s | > 1s |

## Best Practices

1. **Monitor in production** - Real user metrics matter most
2. **Track trends** - Single metrics less important than trends
3. **Set alerts** - Notify team when metrics degrade
4. **Optimize iteratively** - Focus on biggest impact first
5. **Test on real devices** - Emulators don't reflect reality

## Tools Integration

### Recommended Tools
- **Lighthouse CI**: Automated performance testing
- **WebPageTest**: Detailed performance analysis
- **Chrome DevTools**: Local performance profiling
- **React DevTools Profiler**: Component render analysis

### Future Enhancements
- [ ] Store metrics in database
- [ ] Create performance dashboard
- [ ] Set up alerting system
- [ ] Integrate with monitoring service (DataDog, New Relic)
- [ ] Add custom business metrics
