# TopSmile Frontend Test Suite - Implementation Guide

## Quick Start

### 1. Apply Critical Patches (30 minutes)

```bash
# Navigate to project root
cd topsmile-frontend

# Apply patches in order
git apply patches/002-msw-response-structure.patch
git apply patches/001-authcontext-race-condition.patch
git apply patches/003-modal-toast-cleanup.patch

# Run tests to verify
npm test
```

### 2. Add Missing Tests (1 week)

Priority order:
1. Payment retry logic (Day 1-2)
2. Appointment conflict handling (Day 2-3)
3. Network failure scenarios (Day 3-4)
4. Form validation edge cases (Day 4-5)
5. E2E admin workflows (Day 5+)

---

## Detailed Implementation Plan

### Phase 1: Critical Fixes (Week 1)

#### Day 1: MSW Response Structure
**Time**: 2 hours  
**Files**: `patches/002-msw-response-structure.patch`

```bash
# 1. Apply patch
git apply patches/002-msw-response-structure.patch

# 2. Verify no hardcoded 'id' references in tests
grep -r "\.id\s*===" src/tests/
grep -r "data\.id" src/tests/

# 3. Update any found references to use '_id'

# 4. Run integration tests
npm test -- --testPathPattern=integration

# 5. If any failures, check for:
#    - Tests expecting 'id' field
#    - Assertions on user.id vs user._id
```

**Success Criteria**:
- ✅ All integration tests pass
- ✅ No console warnings about missing '_id'
- ✅ Auth flow test completes successfully

---

#### Day 2: AuthContext Race Condition
**Time**: 4 hours  
**Files**: `patches/001-authcontext-race-condition.patch`

```bash
# 1. Apply patch
git apply patches/001-authcontext-race-condition.patch

# 2. Add useRef import if not present
# Verify line: import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback, useRef } from 'react';

# 3. Run AuthContext tests
npm test -- AuthContext.test.tsx

# 4. Monitor for race conditions
npm test -- AuthContext.test.tsx --runInBand --detectOpenHandles
```

**Success Criteria**:
- ✅ AuthContext tests pass consistently (run 10 times)
- ✅ New "prevent concurrent calls" test passes
- ✅ No "Warning: Can't perform a React state update" errors

---

#### Day 3: Modal/Toast Cleanup
**Time**: 1 hour  
**Files**: `patches/003-modal-toast-cleanup.patch`

```bash
# 1. Apply patch
git apply patches/003-modal-toast-cleanup.patch

# 2. Run UI component tests
npm test -- --testPathPattern="components/UI"

# 3. Check for act() warnings
npm test -- Modal.test.tsx Toast.test.tsx 2>&1 | grep "act()"
```

**Success Criteria**:
- ✅ No act() warnings in console
- ✅ Tests pass when run in isolation and in sequence
- ✅ No "Not wrapped in act()" errors

---

### Phase 2: Add Critical Tests (Week 2)

#### Days 4-5: Payment Retry Logic
**Time**: 8 hours  
**File**: Create `src/tests/services/paymentService.retry.test.ts`

```bash
# 1. Copy test from tests_to_add.md (Section 1)
# 2. Create file
touch src/tests/services/paymentService.retry.test.ts

# 3. Add test content
# 4. Run payment tests
npm test -- paymentService

# 5. Verify coverage
npm run test:coverage:frontend -- --collectCoverageFrom=src/services/paymentService.ts
```

**Success Criteria**:
- ✅ All retry scenarios covered
- ✅ Exponential backoff verified
- ✅ Retry limits enforced
- ✅ 90%+ coverage on paymentService

---

#### Days 6-7: Appointment Conflict Handling
**Time**: 6 hours  
**File**: Create `src/tests/integration/AppointmentConflictHandling.test.tsx`

```bash
# 1. Copy test from tests_to_add.md (Section 2)
# 2. Create file
touch src/tests/integration/AppointmentConflictHandling.test.tsx

# 3. Update MSW handlers for conflict scenarios
# 4. Run tests
npm test -- AppointmentConflictHandling

# 5. Test against real backend (optional)
REACT_APP_API_URL=http://staging-api npm test -- AppointmentConflictHandling
```

**Success Criteria**:
- ✅ Conflict detection works
- ✅ Alternative slots suggested
- ✅ Retry after conflict succeeds
- ✅ UI properly disables unavailable slots

---

### Phase 3: Additional Coverage (Week 3)

#### Days 8-9: Network Failure Tests
**File**: `src/tests/services/http.network.test.ts`

```bash
# 1. Copy test from tests_to_add.md (Section 4)
# 2. Create file and run
npm test -- http.network.test.ts

# 3. Verify offline handling
# 4. Test timeout behavior
```

---

#### Day 10: Form Validation Edge Cases
**File**: `src/tests/components/UI/Form/FormValidationEdgeCases.test.tsx`

```bash
# 1. Copy test from tests_to_add.md (Section 5)
# 2. Add XSS protection tests
# 3. Add SQL injection prevention tests
npm test -- FormValidationEdgeCases
```

---

### Phase 4: E2E Coverage (Week 4+)

#### Days 11-15: Admin Workflows
**File**: `cypress/e2e/admin-workflows.cy.ts`

```bash
# 1. Start dev server
npm run dev

# 2. Run Cypress
npm run cy:open

# 3. Add admin workflow tests
# 4. Record video for documentation
npm run cy:run --record
```

---

## Testing Checklist

### Before Committing Changes

```bash
# Run all tests
npm test

# Check coverage
npm run test:coverage

# Run E2E tests
npm run test:e2e

# Lint check
npm run lint

# Type check
npx tsc --noEmit
```

### Coverage Targets

Current vs Target:

| Category | Current | Target | Status |
|----------|---------|--------|--------|
| Branches | 65% | 80% | ⚠️ |
| Functions | 70% | 80% | ⚠️ |
| Lines | 68% | 80% | ⚠️ |
| Statements | 67% | 80% | ⚠️ |

---

## Common Issues & Solutions

### Issue: Tests fail after applying patches

**Solution**:
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install

# Clear Jest cache
npm test -- --clearCache

# Run tests
npm test
```

---

### Issue: MSW handlers not matching

**Solution**:
```bash
# Check handler registration
grep -A 10 "http.post.*api/auth/login" src/mocks/handlers.ts

# Verify response structure matches apiService expectations
# Compare with src/services/apiService.ts
```

---

### Issue: Async tests timing out

**Solution**:
```typescript
// Increase timeout for specific test
it('slow test', async () => {
  // ...
}, 15000); // 15 second timeout

// Or in jest.config.js
testTimeout: 10000
```

---

### Issue: act() warnings

**Solution**:
```typescript
// Wrap state updates in act()
import { act } from '@testing-library/react';

act(() => {
  jest.advanceTimersByTime(1000);
});

// Or use waitFor
await waitFor(() => {
  expect(screen.getByText('Updated')).toBeInTheDocument();
});
```

---

## Continuous Integration

### GitHub Actions Workflow

```yaml
name: Frontend Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Run tests
        run: npm test -- --coverage
        
      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage/lcov.info
          
      - name: Run E2E tests
        run: npm run test:e2e
```

---

## Monitoring & Maintenance

### Weekly Tasks
- Review failed test reports
- Update MSW handlers if backend changes
- Check coverage reports
- Review and close resolved issues

### Monthly Tasks
- Update dependencies
- Review test performance
- Refactor slow tests
- Update test documentation

---

## Support & Resources

### Documentation
- [React Testing Library Docs](https://testing-library.com/react)
- [MSW Documentation](https://mswjs.io/)
- [Jest Documentation](https://jestjs.io/)
- [Cypress Best Practices](https://docs.cypress.io/guides/references/best-practices)

### Internal Resources
- `FRONTEND_TEST_REVIEW.md` - Complete test review
- `tests_to_add.md` - Test implementation examples
- `issues.json` - Machine-readable issue list
- `patches/` directory - Fix implementations

---

## Success Metrics

### Target Metrics (3 months)

- ✅ 80%+ code coverage
- ✅ <1% flaky test rate
- ✅ <5 minute test suite runtime
- ✅ Zero critical security vulnerabilities
- ✅ 100% of critical flows tested

### Current Status

- ⚠️ 68% code coverage (need +12%)
- ⚠️ 3-5% flaky tests (race conditions)
- ✅ ~45 second test runtime (good)
- ⚠️ MSW mismatch causing false confidence
- ⚠️ Payment/conflict flows undertested

---

## Next Steps

1. **This Week**: Apply all critical patches
2. **Week 2**: Add payment retry tests
3. **Week 3**: Add conflict handling tests
4. **Week 4**: E2E admin workflows
5. **Month 2**: Achieve 80% coverage target

**Questions?** Review `FRONTEND_TEST_REVIEW.md` for detailed analysis.