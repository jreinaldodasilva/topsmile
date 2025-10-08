// backend/src/middleware/index.ts
// Auth middleware
export { authenticate, authorize, AuthenticatedRequest } from './auth/auth';
export * from './auth/patientAuth';
export * from './auth/mfaVerification';
export { requirePermission as requirePermissionAuth, checkResourceOwnership, requireClinicAccess } from './auth/permissions';
export * from './auth/roleBasedAccess';

// Security middleware
export { csrfProtection, mongoSanitization } from './security/security';
export { createRateLimiter, rateLimiters } from './security/rateLimiter';
export * from './security/passwordPolicy';

// Validation middleware
export { validate } from './validation/validation';

// Core middleware
export { checkDatabaseConnection, handleValidationError } from './database';
export { errorHandler } from './errorHandler';
export { auditLogger } from './auditLogger';
export { responseWrapper } from './normalizeResponse';
