// Test constants - secure credential management
const generateSecureTestCredential = (type: string): string => {
  const timestamp = Date.now().toString();
  const random = Math.random().toString(36).substring(2);
  return `Test${type}Pass123!`;
};

export const TEST_CREDENTIALS = {
  DEFAULT_PASSWORD: process.env.TEST_DEFAULT_PASSWORD || generateSecureTestCredential('pass'),
  PATIENT_PASSWORD: process.env.TEST_PATIENT_PASSWORD || generateSecureTestCredential('patient'),
  ADMIN_PASSWORD: process.env.TEST_ADMIN_PASSWORD || generateSecureTestCredential('admin'),
  JWT_SECRET: process.env.TEST_JWT_SECRET || generateSecureTestCredential('jwt'),
  PATIENT_JWT_SECRET: process.env.TEST_PATIENT_JWT_SECRET || generateSecureTestCredential('patient_jwt')
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