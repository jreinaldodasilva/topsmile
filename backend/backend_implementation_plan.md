# Backend Implementation Plan

# Backend Implementation Plan - Group 1:  Core Foundation

## High Priority Tasks
## Completed Tasks
- [x] Create src/types/errors.ts with proper error classes and types
- [x] Create src/middleware/errorHandler.ts for centralized error handling
- [x] Create src/services/emailService.ts to handle email sending logic
- [x] Create src/routes/contact.ts and move contact form logic from app.ts
- [x] Create src/routes/admin/contacts.ts and move admin contact endpoints from app.ts
- [x] Update tsconfig.json with recommended settings (ES2022 target, remove redundant options)
- [x] Update app.ts to use new routes, remove inline logic, and improve environment validation
- [x] Add any missing dependencies (redis if needed)

## Followup Steps
- [x] Test the refactored code
- [x] Run build to ensure no TypeScript errors
- [x] Verify routes work correctly
- [x] Update any tests if needed


# Backend Implementation Plan - Group 2: Authentication & Security Enhancements

## High Priority Tasks

### 1. Integrate Custom Error Types in AuthService
- [x] Replace generic `Error` throwing with custom error classes from `errors.ts`
- [x] Update `authService.ts` methods: `register`, `login`, `verifyAccessToken`, `refreshAccessToken`, `changePassword`, `resetPassword`
- [x] Add proper error handling for MongoDB validation errors, duplicate key errors, etc.

### 2. Add Account Lockout Mechanism
- [x] Add `loginAttempts` and `lockUntil` fields to User model
- [x] Implement `incLoginAttempts()`, `resetLoginAttempts()`, and `isLocked()` methods
- [x] Update login logic to check and increment attempts
- [x] Add lockout duration (e.g., 2 hours after 5 failed attempts)

### 3. Verify Clinic Model Integration
- [x] Confirm Clinic model is properly referenced in authService
- [x] Ensure clinic creation in registration works correctly

## Medium Priority Tasks

### 4. Add JWT Blacklisting for Secure Logout
- [x] Create `TokenBlacklistService` class with Redis/memory storage
- [x] Implement `addToBlacklist()` and `isBlacklisted()` methods
- [x] Update logout methods to blacklist tokens
- [x] Add blacklist checking in token verification

### 5. Implement Session Management
- [ ] Create `ActiveSession` interface and `SessionManager` class
- [ ] Track active sessions per user with device info
- [ ] Add methods: `createSession`, `updateLastActivity`, `revokeSession`, `getActiveSessions`
- [ ] Integrate with login/logout flows

### 6. Add Rate Limiting to Authentication Endpoints
- [ ] Implement rate limiter middleware using `express-rate-limit`
- [ ] Apply to `/auth/login` and `/auth/register` routes
- [ ] Configure limits: 5 attempts per 15 minutes for login

## Low Priority Tasks (Future Enhancements)

### 7. Add 2FA Support
- [ ] Design 2FA flow with TOTP (Time-based One-Time Password)
- [ ] Add 2FA secret field to User model
- [ ] Implement QR code generation for authenticator apps

### 8. Implement Password History
- [ ] Add password history tracking to prevent reuse
- [ ] Store last N passwords (hashed) in User model
- [ ] Validate new passwords against history

### 9. Add Security Audit Logging
- [ ] Implement comprehensive audit logging for security events
- [ ] Log failed login attempts, password changes, token revocations
- [ ] Store audit logs with user context and timestamps

## Implementation Order
1. Start with High Priority: Error types integration and account lockout
2. Then Medium Priority: JWT blacklisting and session management
3. Finally Low Priority: Advanced security features

## Testing Requirements
- [ ] Unit tests for new error handling
- [ ] Integration tests for account lockout
- [ ] Security tests for rate limiting and blacklisting
- [ ] Performance tests for session management

## Dependencies
- [ ] Ensure `express-rate-limit` is installed for rate limiting
- [ ] Consider Redis for production token blacklisting
- [ ] Update error handler middleware if needed
