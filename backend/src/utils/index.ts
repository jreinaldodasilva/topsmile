// backend/src/utils/index.ts
// Error utilities

// Cache utilities
export * from './cache';

// Validation utilities (excluding ValidationError to avoid conflict)
export { 
  emailSchema, 
  passwordSchema, 
  phoneSchema, 
  objectIdSchema,
  loginSchema,
  registerSchema,
  patientRegistrationSchema,
  appointmentSchema,
  validateRequest
} from './validation';

// Core utilities
export * from './pagination';
export * from './time';
export * from './errors/errors';
