// Security configuration with environment-based settings
export const securityConfig = {
  jwt: {
    secret: process.env.JWT_SECRET || (() => {
      if (process.env.NODE_ENV === 'production') {
        throw new Error('JWT_SECRET must be set in production');
      }
      return 'development-jwt-secret-key';
    })(),
    refreshSecret: process.env.JWT_REFRESH_SECRET || (() => {
      if (process.env.NODE_ENV === 'production') {
        throw new Error('JWT_REFRESH_SECRET must be set in production');
      }
      return 'development-refresh-secret-key';
    })(),
    patientSecret: process.env.PATIENT_JWT_SECRET || (() => {
      if (process.env.NODE_ENV === 'production') {
        throw new Error('PATIENT_JWT_SECRET must be set in production');
      }
      return 'development-patient-jwt-secret-key';
    })(),
    expiresIn: '15m',
    refreshExpiresIn: '7d',
    issuer: 'topsmile-api',
    audience: 'topsmile-client'
  },
  
  test: {
    jwtSecret: process.env.TEST_JWT_SECRET || 'test-jwt-secret-key',
    patientJwtSecret: process.env.TEST_PATIENT_JWT_SECRET || 'test-patient-jwt-secret-key',
    defaultPassword: process.env.TEST_DEFAULT_PASSWORD || 'TestPassword123!',
    patientPassword: process.env.TEST_PATIENT_PASSWORD || 'PatientPass123!',
    providerPassword: process.env.TEST_PROVIDER_PASSWORD || 'ProviderPass123!'
  },
  
  rateLimiting: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 100,
    authMaxRequests: 5 // For login attempts
  },
  
  password: {
    minLength: 8,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecialChars: true
  }
};

export default securityConfig;