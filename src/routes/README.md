# Route Code Splitting

This directory contains centralized lazy-loaded route imports organized by feature area.

## Chunk Strategy

Routes are automatically split into separate chunks by webpack:
- **Public routes**: Home, Features, Pricing, Contact
- **Auth routes**: Login, Register, Password reset
- **Patient routes**: Patient portal pages
- **Admin routes**: Admin dashboard and management pages

## Usage

```tsx
import * as Routes from './routes';

<Route path="/" element={<Routes.Home />} />
```

## Benefits

1. **Smaller initial bundle**: Only load code for current route
2. **Faster page loads**: Parallel loading of route chunks
3. **Better caching**: Route changes don't invalidate entire bundle
4. **Organized imports**: Single source of truth for route components

## Preloading

Use preload functions from `utils/lazyImports.ts`:
- `preloadCriticalComponents()`: Login pages
- `preloadAdminComponents()`: Admin pages after admin login
- `preloadPatientComponents()`: Patient pages after patient login
