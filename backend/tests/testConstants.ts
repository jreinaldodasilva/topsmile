// Test constants - use environment variables for security
export const TEST_CREDENTIALS = {
  DEFAULT_PASSWORD: process.env.TEST_DEFAULT_PASSWORD || 'TestPass123!',
  PATIENT_PASSWORD: process.env.TEST_PATIENT_PASSWORD || 'PatientPass123!',
  ADMIN_PASSWORD: process.env.TEST_ADMIN_PASSWORD || 'AdminPass123!',
  JWT_SECRET: process.env.TEST_JWT_SECRET || 'test-jwt-secret-key-change-in-production',
  PATIENT_JWT_SECRET: process.env.TEST_PATIENT_JWT_SECRET || 'test-patient-jwt-secret-key'
} as const;

// Validation to ensure secrets are properly set in CI/production
if (process.env.NODE_ENV === 'production' || process.env.CI) {
  const requiredEnvVars = [
    'TEST_DEFAULT_PASSWORD',
    'TEST_PATIENT_PASSWORD', 
    'TEST_ADMIN_PASSWORD',
    'TEST_JWT_SECRET',
    'TEST_PATIENT_JWT_SECRET'
  ];
  
  const missing = requiredEnvVars.filter(envVar => !process.env[envVar]);
  if (missing.length > 0) {
    throw new Error(`Missing required test environment variables: ${missing.join(', ')}`);
  }
}