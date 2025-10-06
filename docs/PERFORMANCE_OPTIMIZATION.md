# Performance Optimization Guide

## Overview

This guide documents performance optimizations implemented in TopSmile and provides strategies for maintaining optimal performance.

## Performance Metrics

### Target Metrics
- **Page Load**: < 3 seconds
- **API Response**: < 500ms (p95), < 1s (p99)
- **Database Queries**: < 100ms
- **Bundle Size**: < 1MB
- **Lighthouse Score**: > 90

## Backend Optimizations

### 1. Database Indexing

**Implemented Indexes**:
```javascript
// Appointments
AppointmentSchema.index({ clinic: 1, scheduledStart: 1, status: 1 });
AppointmentSchema.index({ provider: 1, scheduledStart: 1, scheduledEnd: 1, status: 1 });
AppointmentSchema.index({ patient: 1, scheduledStart: -1 });

// Patients
PatientSchema.index({ clinic: 1, email: 1 }, { unique: true });
PatientSchema.index({ clinic: 1, name: 1 });

// Providers
ProviderSchema.index({ clinic: 1, isActive: 1 });
```

**Impact**: 80% reduction in query time for common operations

### 2. Query Optimization

**Use Lean Queries**:
```typescript
// Before
const appointments = await Appointment.find({ status: 'scheduled' });

// After
const appointments = await Appointment.find({ status: 'scheduled' }).lean();
```

**Select Only Needed Fields**:
```typescript
const patients = await Patient.find()
  .select('name email phone')
  .lean();
```

**Limit Population**:
```typescript
const appointments = await Appointment.find()
  .populate('patient', 'name email')
  .populate('provider', 'name specialty')
  .lean();
```

### 3. Caching Strategy

**Redis Caching**:
```typescript
// Cache provider data (rarely changes)
const cacheKey = `providers:${clinicId}`;
let providers = await cache.get(cacheKey);

if (!providers) {
  providers = await Provider.find({ clinic: clinicId }).lean();
  await cache.set(cacheKey, providers, 3600); // 1 hour
}
```

**Cache Invalidation**:
```typescript
// Invalidate on update
await Provider.findByIdAndUpdate(id, data);
await cache.del(`providers:${clinicId}`);
```

### 4. Pagination

**Always Paginate Large Datasets**:
```typescript
const page = parseInt(req.query.page) || 1;
const limit = parseInt(req.query.limit) || 20;
const skip = (page - 1) * limit;

const appointments = await Appointment.find()
  .skip(skip)
  .limit(limit)
  .lean();
```

### 5. Aggregation Optimization

**Use Indexes in Aggregation**:
```typescript
const stats = await Appointment.aggregate([
  { $match: { clinic: clinicId, status: 'completed' } }, // Uses index
  { $group: { _id: '$provider', count: { $sum: 1 } } },
  { $sort: { count: -1 } }
]);
```

## Frontend Optimizations

### 1. Code Splitting

**Route-Based Splitting**:
```typescript
const AdminPage = lazy(() => import('./pages/Admin/AdminPage'));
const PatientDashboard = lazy(() => import('./pages/Patient/Dashboard'));
```

**Component-Based Splitting**:
```typescript
const DentalChart = lazy(() => import('./components/DentalChart'));
```

### 2. Lazy Loading

**Images**:
```typescript
<LazyImage src={imageUrl} alt="Description" />
```

**Components**:
```typescript
<Suspense fallback={<Loading />}>
  <HeavyComponent />
</Suspense>
```

### 3. Memoization

**React.memo**:
```typescript
export const ExpensiveComponent = React.memo(({ data }) => {
  return <div>{/* render */}</div>;
});
```

**useMemo**:
```typescript
const filteredData = useMemo(() => {
  return data.filter(item => item.active);
}, [data]);
```

**useCallback**:
```typescript
const handleClick = useCallback(() => {
  doSomething(id);
}, [id]);
```

### 4. Virtual Scrolling

**For Large Lists**:
```typescript
import { FixedSizeList } from 'react-window';

<FixedSizeList
  height={600}
  itemCount={items.length}
  itemSize={50}
>
  {Row}
</FixedSizeList>
```

### 5. Debouncing

**Search Inputs**:
```typescript
const debouncedSearch = useMemo(
  () => debounce((value) => {
    performSearch(value);
  }, 300),
  []
);
```

## Load Testing

### Running Load Tests

**k6 Load Test**:
```bash
cd backend/tests/performance
k6 run load-test.js
```

**With Custom Target**:
```bash
k6 run --env BASE_URL=https://staging.topsmile.com load-test.js
```

### Interpreting Results

**Good Performance**:
- p95 < 500ms
- p99 < 1000ms
- Error rate < 1%

**Action Required**:
- p95 > 1000ms
- p99 > 2000ms
- Error rate > 5%

## Query Analysis

### Analyze Slow Queries

```bash
cd backend
npm run analyze:queries
```

### Optimization Checklist

- [ ] Query uses index
- [ ] Only necessary fields selected
- [ ] Pagination implemented
- [ ] Lean queries used
- [ ] Population limited
- [ ] Caching considered

## Bundle Optimization

### Analyze Bundle

```bash
npm run analyze
```

### Optimization Strategies

1. **Remove Unused Dependencies**
```bash
npm uninstall unused-package
```

2. **Use Lighter Alternatives**
- moment.js → date-fns (smaller)
- lodash → lodash-es (tree-shakeable)

3. **Dynamic Imports**
```typescript
const module = await import('./heavy-module');
```

4. **Tree Shaking**
```typescript
// Import only what you need
import { specific } from 'library';
```

## Monitoring

### Performance Monitoring

**Web Vitals**:
```typescript
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

getCLS(console.log);
getFID(console.log);
getFCP(console.log);
getLCP(console.log);
getTTFB(console.log);
```

### Database Monitoring

**Enable Profiling**:
```javascript
mongoose.set('debug', true);
```

**Slow Query Log**:
```javascript
db.setProfilingLevel(1, { slowms: 100 });
```

## Performance Checklist

### Backend
- [x] Database indexes created
- [x] Queries optimized with lean()
- [x] Pagination implemented
- [x] Caching strategy in place
- [x] Connection pooling configured

### Frontend
- [x] Code splitting implemented
- [x] Lazy loading for routes
- [x] Images optimized
- [x] Memoization used
- [x] Bundle size < 1MB

### Infrastructure
- [ ] CDN for static assets
- [ ] Gzip compression enabled
- [ ] HTTP/2 enabled
- [ ] Database read replicas
- [ ] Load balancer configured

## Common Issues

### Slow API Responses

**Diagnosis**:
```bash
# Check query performance
npm run analyze:queries

# Run load test
k6 run backend/tests/performance/load-test.js
```

**Solutions**:
- Add missing indexes
- Implement caching
- Optimize queries
- Add pagination

### Large Bundle Size

**Diagnosis**:
```bash
npm run analyze
```

**Solutions**:
- Implement code splitting
- Remove unused dependencies
- Use dynamic imports
- Enable tree shaking

### Memory Leaks

**Diagnosis**:
- Monitor memory usage
- Use Chrome DevTools
- Check for event listener cleanup

**Solutions**:
- Clean up subscriptions
- Remove event listeners
- Clear intervals/timeouts
- Use weak references

## Best Practices

1. **Always measure before optimizing**
2. **Focus on user-perceived performance**
3. **Optimize critical rendering path**
4. **Use production builds for testing**
5. **Monitor performance in production**
6. **Set performance budgets**
7. **Regular performance audits**

## Resources

- [Web Vitals](https://web.dev/vitals/)
- [k6 Documentation](https://k6.io/docs/)
- [MongoDB Performance](https://docs.mongodb.com/manual/administration/analyzing-mongodb-performance/)
- [React Performance](https://react.dev/learn/render-and-commit)
