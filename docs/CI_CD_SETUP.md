# CI/CD Setup Guide

## Overview

TopSmile uses GitHub Actions for continuous integration and deployment. The CI/CD pipeline includes automated testing, code quality checks, and deployment workflows.

## Workflows

### 1. Test Suite (`.github/workflows/test.yml`)

Runs on every push and pull request to `main` and `develop` branches.

#### Jobs

**Backend Tests**
- Runs unit, integration, and E2E tests
- Uses MongoDB and Redis services
- Generates coverage reports
- Uploads results to Codecov

**Frontend Tests**
- Runs Jest tests with coverage
- Generates JUnit XML reports
- Uploads coverage to Codecov
- Uploads test results as artifacts

**E2E Tests**
- Runs Cypress tests in Chrome
- Records test runs (if configured)
- Uploads screenshots on failure
- Uploads videos for all runs

**Security Tests**
- Runs security-focused test suite
- Tests authentication and authorization
- Tests input validation and sanitization

#### Required Secrets

```
TEST_JWT_SECRET
TEST_PATIENT_JWT_SECRET
TEST_DEFAULT_PASSWORD
TEST_PATIENT_PASSWORD
TEST_ADMIN_PASSWORD
CYPRESS_RECORD_KEY (optional)
```

### 2. Code Quality (`.github/workflows/quality.yml`)

Runs on every push and pull request.

#### Jobs

**Lint**
- ESLint for frontend and backend
- Enforces code style consistency

**Type Check**
- TypeScript compilation check
- Ensures type safety

**Security Audit**
- npm audit for dependencies
- Checks for known vulnerabilities
- Continues on moderate issues

### 3. PR Validation (`.github/workflows/pr-validation.yml`)

Runs on pull request events.

#### Jobs

**Validate**
- Checks PR title format (semantic)
- Detects merge conflicts
- Checks for large files (>1MB)

**Coverage Check**
- Runs full test suite
- Validates coverage thresholds (70%)
- Fails if coverage drops below threshold

## Test Commands

### Frontend

```bash
# Run tests in CI mode
npm run test:frontend:ci

# Run tests with coverage
npm run test:frontend:coverage

# Run tests in watch mode
npm run test:frontend:watch
```

### Backend

```bash
# Run all tests
cd backend && npm test

# Run tests with coverage
cd backend && npm run test:coverage

# Run tests in CI mode
cd backend && npm run test:ci

# Run specific test suites
cd backend && npm run test:unit
cd backend && npm run test:integration
cd backend && npm run test:e2e
```

### E2E Tests

```bash
# Run Cypress tests headless
npm run test:e2e

# Open Cypress UI
npm run test:e2e:open
```

## Coverage Reporting

### Configuration

**Frontend**: `jest.config.js`
```javascript
coverageThreshold: {
  global: {
    branches: 70,
    functions: 70,
    lines: 70,
    statements: 70,
  },
}
```

**Backend**: `backend/jest.config.js`
```javascript
coverageThreshold: {
  global: {
    branches: 70,
    functions: 70,
    lines: 70,
    statements: 70
  }
}
```

### Reports

Coverage reports are generated in:
- Frontend: `coverage/frontend/`
- Backend: `backend/coverage/`

JUnit XML reports for CI:
- Frontend: `reports/junit-frontend.xml`
- Backend: `backend/reports/junit-backend.xml`

### Codecov Integration

Coverage reports are automatically uploaded to Codecov:
- Frontend: `frontend` flag
- Backend: `backend` flag

## Local Testing

### Run Full Test Suite

```bash
# All tests
npm run test:all

# With coverage
npm run test:coverage

# CI mode (recommended before pushing)
npm run test:ci
```

### Pre-commit Checks

```bash
# Lint
npm run lint

# Type check
npm run type-check

# Run tests
npm test
```

## CI/CD Best Practices

### 1. Test Isolation
- Each test should be independent
- Use test fixtures and factories
- Clean up after tests

### 2. Fast Feedback
- Unit tests run first (fastest)
- Integration tests run second
- E2E tests run last (slowest)

### 3. Parallel Execution
- Frontend and backend tests run in parallel
- Use `maxWorkers` to control parallelism
- CI uses `--maxWorkers=2` for stability

### 4. Caching
- npm dependencies are cached
- Speeds up subsequent runs
- Cache key based on package-lock.json

### 5. Artifacts
- Test results uploaded as artifacts
- Screenshots and videos for E2E tests
- Coverage reports for analysis

## Troubleshooting

### Tests Fail in CI but Pass Locally

**Common causes**:
1. Environment differences
2. Timing issues (use `waitFor`)
3. Missing environment variables
4. Database state issues

**Solutions**:
```bash
# Run tests in CI mode locally
CI=true npm run test:frontend:ci

# Use same Node version as CI
nvm use 18

# Clear cache
npm run test:frontend -- --clearCache
```

### Coverage Threshold Failures

**Check coverage**:
```bash
npm run test:coverage
```

**View detailed report**:
```bash
open coverage/frontend/lcov-report/index.html
open backend/coverage/lcov-report/index.html
```

**Fix low coverage**:
1. Identify uncovered files
2. Write tests for critical paths
3. Focus on business logic first

### E2E Test Failures

**Debug locally**:
```bash
npm run cy:open
```

**Check artifacts**:
- Screenshots in `cypress/screenshots/`
- Videos in `cypress/videos/`

**Common issues**:
1. Timing issues → Add explicit waits
2. Selector changes → Use data-testid
3. API mocking → Check MSW handlers

## GitHub Actions Configuration

### Workflow Triggers

```yaml
on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]
```

### Service Containers

```yaml
services:
  mongodb:
    image: mongo:6
    ports:
      - 27017:27017
  redis:
    image: redis:7
    ports:
      - 6379:6379
```

### Matrix Strategy (Optional)

Test across multiple Node versions:

```yaml
strategy:
  matrix:
    node-version: [18, 20]
```

## Deployment Integration

### Staging Deployment

Triggered on push to `develop`:
```yaml
on:
  push:
    branches: [develop]
```

### Production Deployment

Triggered on push to `main`:
```yaml
on:
  push:
    branches: [main]
```

### Manual Deployment

Use workflow_dispatch:
```yaml
on:
  workflow_dispatch:
    inputs:
      environment:
        description: 'Environment to deploy'
        required: true
        default: 'staging'
```

## Monitoring and Alerts

### Test Failures
- GitHub Actions sends notifications
- Check Actions tab for details
- Review logs and artifacts

### Coverage Drops
- Codecov comments on PRs
- Shows coverage diff
- Blocks merge if below threshold

### Security Issues
- Dependabot alerts
- npm audit in CI
- Review and update dependencies

## Next Steps

1. ✅ Configure GitHub secrets
2. ✅ Set up Codecov account
3. ⏭️ Configure Cypress Dashboard (optional)
4. ⏭️ Set up deployment workflows
5. ⏭️ Configure status checks for PRs

## Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Jest Documentation](https://jestjs.io/)
- [Cypress Documentation](https://docs.cypress.io/)
- [Codecov Documentation](https://docs.codecov.com/)
