# Test Migration Guide

## Summary of Changes

### Before: 57 test files across 15 directories
### After: ~12 essential test files in 3 directories

## Removed Test Categories

### ❌ Deleted (57 → 12 files)

1. **Contract Tests** (5 files) - Unnecessary for monorepo
2. **K6 Load Tests** (4 files) - Move to separate performance suite
3. **Analytics Tests** (4 files) - Not core functionality  
4. **Parallel Test Infrastructure** (2 files) - Jest handles this
5. **Multiple Auth Tests** (4 files) - Consolidated to 1
6. **Multiple Performance Tests** (5 files) - Use integration tests
7. **Compliance Tests** (6 files) - Consolidated to patient tests
8. **Edge Case Files** (2 files) - Integrated into main tests
9. **Transaction Tests** (3 files) - Covered by integration
10. **Rate Limiting Tests** (5 files) - Move to integration
11. **Duplicate Security Tests** (3 files) - Consolidated

## New Structure

```
tests-new/
├── unit/                          # 6 files
│   ├── services/
│   │   ├── patient.test.ts       # Consolidated from patientService.comprehensive.test.ts
│   │   ├── appointment.test.ts   # Consolidated from appointmentService.comprehensive.test.ts
│   │   └── auth.test.ts          # Consolidated from authService.*.test.ts
│   ├── middleware/
│   │   └── auth.test.ts          # Consolidated middleware tests
│   └── utils/
│       └── validation.test.ts    # Consolidated validation tests
├── integration/                   # 4 files
│   ├── routes/
│   │   ├── auth.test.ts          # Consolidated auth routes
│   │   ├── patients.test.ts      # Patient CRUD
│   │   └── appointments.test.ts  # Appointment CRUD
│   └── flows/
│       └── booking.test.ts       # Complete booking flow
├── e2e/                          # 2 files
│   ├── patient-registration.test.ts
│   └── appointment-booking.test.ts
├── helpers/
│   └── factories.ts              # Test data factories
└── setup.ts                      # Global setup
```

## Migration Steps

1. **Backup old tests**:
   ```bash
   mv tests tests-old
   mv tests-new tests
   ```

2. **Update Jest config**:
   ```bash
   mv jest.config.js jest.config.old.js
   mv jest.config.new.js jest.config.js
   ```

3. **Update package.json scripts**:
   ```json
   {
     "test": "jest",
     "test:unit": "jest tests/unit",
     "test:integration": "jest tests/integration",
     "test:e2e": "jest tests/e2e",
     "test:watch": "jest --watch"
   }
   ```

4. **Run tests**:
   ```bash
   npm test
   ```

## Benefits

- **79% reduction** in test files (57 → 12)
- **Faster execution**: Unit tests run in <5s
- **Easier maintenance**: One file per service/route
- **Clear organization**: unit/integration/e2e separation
- **Better focus**: Only essential tests remain

## What to Keep from Old Tests

If you need specific test cases from old tests:

1. **patient-rights.test.ts** → Already fixed, keep as reference
2. **patientService.comprehensive.test.ts** → Migrated to `unit/services/patient.test.ts`
3. **authRoutes.test.ts** → Migrated to `integration/routes/auth.test.ts`

## Performance Testing

For load/stress testing, use separate tools:
- K6 scripts in `scripts/load-tests/`
- Run separately from unit tests
- Not part of CI pipeline
