// Test constants - centralized credentials
export const TEST_CREDENTIALS = {
  ADMIN_EMAIL: process.env.TEST_ADMIN_EMAIL || 'admin@topsmile.com',
  ADMIN_PASSWORD: process.env.TEST_ADMIN_PASSWORD || 'SecurePass123!',
  PATIENT_EMAIL: process.env.TEST_PATIENT_EMAIL || 'patient@example.com',
  PATIENT_PASSWORD: process.env.TEST_PATIENT_PASSWORD || 'PatientPass123!',
  DEFAULT_PASSWORD: process.env.TEST_DEFAULT_PASSWORD || 'TestPass123!'
} as const;

// Validation for CI/production
if (process.env.NODE_ENV === 'production' || process.env.CI) {
  const requiredEnvVars = [
    'TEST_ADMIN_EMAIL',
    'TEST_ADMIN_PASSWORD',
    'TEST_PATIENT_EMAIL',
    'TEST_PATIENT_PASSWORD',
    'TEST_DEFAULT_PASSWORD'
  ];
  
  const missing = requiredEnvVars.filter(envVar => !process.env[envVar]);
  if (missing.length > 0) {
    console.warn(`Missing test environment variables: ${missing.join(', ')}`);
  }
}
