# Quick Start - Testing Infrastructure

**For developers who want to get started immediately**

---

## 🚀 Run Tests Now

```bash
# All tests
npm test

# Backend only
cd backend && npm test

# Frontend only
npm run test:frontend

# E2E tests
npm run test:e2e

# With coverage
npm run test:coverage
```

---

## ✅ What's Working

- ✅ Backend unit tests (most passing)
- ✅ Backend auth tests (fixed!)
- ✅ Frontend component tests (68% passing)
- ✅ E2E tests (Cypress configured)
- ✅ Security tests (auth focused)

---

## 🔴 What's Broken

- 🔴 22 backend integration tests (business logic)
- 🔴 86 frontend tests (async/loading issues)
- 🔴 Coverage at 17% (target: 70%)

---

## 🔧 Recent Fix

**Problem**: Integration tests failing with 401 Unauthorized

**Solution**: Fixed in `backend/tests/setup.ts`
```typescript
// Set env vars BEFORE imports
import { TEST_CREDENTIALS } from './testConstants';
process.env.JWT_SECRET = TEST_CREDENTIALS.JWT_SECRET;
process.env.PATIENT_JWT_SECRET = TEST_CREDENTIALS.PATIENT_JWT_SECRET;
```

**Result**: Integration test pass rate 0% → 42%

---

## 📊 Current Status

| Metric | Value | Target |
|--------|-------|--------|
| Backend Pass Rate | 60% | 95% |
| Frontend Pass Rate | 68% | 95% |
| Coverage (Lines) | 17% | 70% |
| Test Execution | 243s | <120s |

---

## 🎯 Next Steps

### For Developers
1. Run tests locally: `npm test`
2. Fix failing tests in your area
3. Add tests for new features
4. Maintain >70% coverage

### For Team Lead
1. Review [Full Audit](./TESTING_INFRASTRUCTURE_AUDIT.md)
2. Approve [Action Plan](./TESTING_ACTION_PLAN.md)
3. Allocate resources for Phase 1
4. Track progress weekly

---

## 📚 Documentation

- **Full Audit**: `TESTING_INFRASTRUCTURE_AUDIT.md` (comprehensive)
- **Action Plan**: `TESTING_ACTION_PLAN.md` (5-week plan)
- **Progress**: `PHASE1_PROGRESS_REPORT.md` (current status)
- **Summary**: `IMPLEMENTATION_SUMMARY.md` (executive overview)

---

## 🆘 Common Issues

### Issue: Tests timing out
**Fix**: Increase timeout in `jest.config.js`
```javascript
testTimeout: 10000, // or higher
```

### Issue: 401 Unauthorized in integration tests
**Fix**: Already fixed! Update from main branch.

### Issue: Frontend tests stuck in loading
**Fix**: In progress. Check MSW handlers match API calls.

### Issue: Coverage not generating
**Fix**: Run `npm run test:coverage` after all tests pass.

---

## 💡 Pro Tips

1. **Run fast tests during development**
   ```bash
   npm run test:fast  # Only changed files
   ```

2. **Debug specific test**
   ```bash
   npm test -- path/to/test.ts
   ```

3. **Watch mode for TDD**
   ```bash
   npm test -- --watch
   ```

4. **Check coverage for specific file**
   ```bash
   npm test -- --coverage --collectCoverageFrom="src/path/to/file.ts"
   ```

---

## 🔗 Quick Links

- [Testing Strategy](./docs/tests/TESTING_STRATEGY.md)
- [Testing Guide](./docs/tests/TESTING_GUIDE.md)
- [Backend Tests README](./backend/tests/README.md)
- [CI/CD Workflow](./.github/workflows/test.yml)

---

**Last Updated**: January 2025  
**Status**: Phase 1 In Progress  
**Questions?**: Contact Development Team Lead
