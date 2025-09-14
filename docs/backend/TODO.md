# Fix TypeScript Errors

## Models
- [x] Fix Clinic.ts: Cast `this` in pre-save hook and define WorkingHours type
- [x] Fix Patient.ts: Cast `this` in pre-save hook
- [x] Fix Contact.ts: Simplify IContactModel to avoid circular reference

## Services
- [x] Fix authService.ts: Cast error as any for name property check
- [x] Fix contactService.ts: Investigate and fix excessive type instantiation
- [x] Fix patientAuthService.ts: Cast populated patient and fix jwt.sign options

## Verification
- [ ] Run TypeScript compilation to verify all errors are fixed
