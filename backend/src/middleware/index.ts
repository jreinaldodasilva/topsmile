// backend/src/middleware/index.ts
export { authenticate, authorize, AuthenticatedRequest } from './auth';
export { validate } from './validation';
export { errorHandler } from './errorHandler';
export { auditLogger } from './auditLogger';
export { createRateLimiter, rateLimiters } from './rateLimiter';
export { csrfProtection, mongoSanitization } from './security';
export { checkDatabaseConnection, handleValidationError } from './database';
export { responseWrapper } from './normalizeResponse';
