# TODO: Fix TypeScript Errors in patientAuthService.ts

## Tasks
- [x] Update IPatientUser interface in backend/src/models/PatientUser.ts to include method signatures for comparePassword, isLocked, incLoginAttempts, resetLoginAttempts
- [x] Update backend/src/services/patientAuthService.ts to import SignOptions from jsonwebtoken and use typed options for jwt.sign calls
- [x] Verify that TypeScript errors are resolved by running type check
