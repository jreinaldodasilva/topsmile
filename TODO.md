# TODO: Fix TypeScript Compilation Errors

## Completed Tasks
- [x] Add missing patientAuth methods to apiService (login, register, me)
- [x] Add missing forms methods to apiService (templates.getOne, responses.create)
- [x] Fix ProtectedRoute children type from ReactNode to ReactElement
- [x] Update AuthContext test files to use AuthStateContext/AuthActionsContext
- [x] Fix Dashboard patientsArray type handling
- [x] Update MSW handlers to use v2 API (http, HttpResponse)

## Pending Tasks
- [x] Fix MSW v2 API migration (updated handlers.ts and mocks)
- [x] Fix FormRendererPage FormResponse type mismatch (added CreateFormResponse type)
- [x] Fix PatientDashboard status handling (made functions accept optional status)
- [x] Fix apiService-updated.ts Contact and Patient type issues (updated mappers)
- [ ] Check remaining TypeScript compilation errors (if any)
- [ ] Fix TransformStream polyfill issues in Jest
- [ ] Run tests to verify all fixes work
- [ ] Ensure no remaining compilation errors

## Current Issues
1. MSW handlers failing in test environment despite correct v2 imports
2. Undefined property access on potentially undefined objects
3. Type mismatches between frontend/backend models
4. Missing null checks for optional properties
5. API service method signatures not matching expected types

## Next Steps
1. Fix remaining 23 compilation errors with proper null checks and type assertions
2. Debug MSW setup - check if polyfills are loaded correctly in test environment
3. Update apiService-updated.ts to match expected method signatures
4. Run TypeScript compilation check
5. Run test suite to verify fixes
