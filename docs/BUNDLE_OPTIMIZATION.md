# Bundle Optimization Guide

## Current Optimizations

### 1. Code Splitting
- Route-based splitting (automatic with React.lazy)
- Component-based splitting (heavy components)
- Vendor splitting (React, Stripe, etc.)

### 2. Production Build
```bash
npm run build              # Optimized production build
npm run build:analyze      # Build with bundle analysis
npm run analyze            # Analyze existing build
```

### 3. Webpack Configuration
- **Vendor chunks**: React, Stripe separated
- **Common chunks**: Shared code extracted
- **Tree shaking**: Unused code removed
- **Minification**: Terser for JS, cssnano for CSS

### 4. Environment Variables
```
GENERATE_SOURCEMAP=false   # Disable sourcemaps in production
INLINE_RUNTIME_CHUNK=false # Separate runtime chunk
IMAGE_INLINE_SIZE_LIMIT=10000 # 10KB inline limit
```

### 5. Dynamic Imports
Heavy libraries loaded on demand:
- Stripe
- Framer Motion
- React Calendar
- React Slick
- Luxon

## Bundle Size Targets

| Chunk | Target | Current |
|-------|--------|---------|
| Main | < 200KB | TBD |
| Vendors | < 500KB | TBD |
| React | < 150KB | TBD |
| Stripe | < 100KB | TBD |

## Analysis Commands

```bash
# Generate bundle report
ANALYZE=true npm run build

# View bundle composition
npm run analyze

# Check bundle sizes
npm run build && ls -lh build/static/js/
```

## Optimization Checklist

- [x] Route-based code splitting
- [x] Component lazy loading
- [x] Vendor chunk separation
- [x] Production sourcemap disabled
- [x] Dynamic imports for heavy libraries
- [ ] Image optimization
- [ ] Font subsetting
- [ ] CSS purging
- [ ] Compression (gzip/brotli)

## Best Practices

1. **Import only what you need**
   ```tsx
   // Bad
   import * as Icons from 'react-icons';
   
   // Good
   import { FaUser } from 'react-icons/fa';
   ```

2. **Use dynamic imports for conditional features**
   ```tsx
   const loadPayment = async () => {
     const { loadStripe } = await import('./utils/dynamicImports');
     return loadStripe();
   };
   ```

3. **Lazy load heavy components**
   ```tsx
   import { LazyWrapper } from './components/common';
   import { DentalChartView } from './components/lazy';
   
   <LazyWrapper>
     <DentalChartView />
   </LazyWrapper>
   ```

4. **Monitor bundle size in CI/CD**
   - Set size budgets
   - Fail builds if exceeded
   - Track size over time
