## Script Usage Guide

### Development
```bash
# Start both frontend and backend
npm run dev

# Start only frontend
npm run dev:frontend

# Start only backend
npm run dev:backend
```

### Testing
```bash
# Run all tests (frontend + backend)
npm test

# Run only frontend tests
npm run test:frontend

# Run a specific front-end test:
npm run test:frontend test-file-path

# Run only backend tests
npm run test:backend

# Run a specific back-end test:
npm run test:backend test-file-path

# Run with coverage
npm run test:coverage

# Run in CI environment
npm run test:ci

# Run e2e tests
npm run test:e2e
```

### Backend-Specific Tests
```bash
cd backend

# Run unit tests only
npm run test:unit

# Run integration tests only
npm run test:integration

# Run security tests only
npm run test:security

# Run performance tests only
npm run test:performance

# Run edge case tests only
npm run test:edge-cases
```

### Building
```bash
# Build frontend only
npm run build

# Build both frontend and backend
npm run build:all
```

### Code Quality
```bash
# Type check
npm run type-check

# Lint
npm run lint

# Lint and fix
npm run lint:fix
```