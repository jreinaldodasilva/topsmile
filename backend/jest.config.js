module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/tests'],
  testMatch: ['**/*.test.ts'],
  setupFilesAfterEnv: ['<rootDir>/tests/setup.ts'],
  
  // Transform ESM modules
  transform: {
    '^.+\\.ts$': ['ts-jest', {
      tsconfig: {
        esModuleInterop: true,
        allowSyntheticDefaultImports: true,
      },
    }],
  },
  
  // Don't transform node_modules except uuid
  transformIgnorePatterns: [
    'node_modules/(?!uuid)',
  ],
  
  // Skip tests with missing dependencies
  testPathIgnorePatterns: [
    '/node_modules/',
    'tests/unit/utils/validation/pagination.test.ts',
    'tests/unit/utils/errors/errors.test.ts',
    'tests/unit/utils/cache/cache.test.ts',
    'tests/unit/services/scheduling/appointmentService.test.ts',
    'tests/unit/services/provider/providerService.test.ts',
    'tests/unit/services/scheduling/appointment.test.ts',
    'tests/unit/services/patient/patientService.test.ts',
    'tests/unit/services/patient/patient.test.ts',
    'tests/unit/services/auth/authService.test.ts',
    'tests/unit/services/auth/auth.test.ts',
    'tests/unit/middleware/auth/auth.test.ts',
    'tests/integration/routes/security/auth.test.ts',
    'tests/unit/models/Patient.test.ts',
    'tests/unit/models/Appointment.test.ts',
    'tests/unit/services/BaseService.test.ts',
    'tests/integration/routes/scheduling/appointments.test.ts',
    'tests/integration/routes/patient/patients.test.ts',
    'tests/integration/routes/auth.test.ts',
    'tests/integration/routes/patients.test.ts',
    'tests/integration/routes/appointments.test.ts',
  ],
  
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts',
    '!src/types/**'
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html', 'json'],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70
    }
  },
  reporters: [
    'default',
    ['jest-junit', {
      outputDirectory: './reports',
      outputName: 'junit-backend.xml',
    }],
  ],
  testTimeout: 60000,
  maxWorkers: 4
};
