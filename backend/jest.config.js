module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src', '<rootDir>/tests'],
  testMatch: [
    '**/__tests__/**/*.test.ts',
    '**/?(*.)+(spec|test).ts'
  ],
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  transformIgnorePatterns: [
    'node_modules/(?!(supertest|@faker-js/faker)/)'
  ],
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts',
    '!src/app.ts',
    '!src/config/**',
  ],
  coverageDirectory: 'coverage/backend',
  coverageReporters: ['text', 'lcov', 'html', 'json'],
  coverageThreshold: {
    global: {
      branches: 75,
      functions: 75,
      lines: 75,
      statements: 75,
    },
    './tests/performance/**': {
      branches: 60,
      functions: 60,
      lines: 60,
      statements: 60,
    },
    './src/services/authService.ts': {
      branches: 85,
      functions: 85,
      lines: 85,
      statements: 85,
    },
    './src/services/patientService.ts': {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
    './src/middleware/auth.ts': {
      branches: 85,
      functions: 85,
      lines: 85,
      statements: 85,
    },
  },
  setupFilesAfterEnv: ['<rootDir>/tests/setup.ts'],
  testTimeout: 15000, // Reduced timeout for faster feedback
  bail: 1, // Stop on first failure for faster feedback
  cache: true,
  cacheDirectory: '<rootDir>/.jest-cache',
  detectOpenHandles: false, // Disabled for performance
  forceExit: true, // Force exit for faster cleanup

  reporters: [
    'default',
    ['jest-junit', { outputDirectory: 'reports', outputName: 'junit-backend.xml' }],
  ],
  moduleNameMapper: {
    '^@topsmile/types$': '<rootDir>/../packages/types/src',
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@tests/(.*)$': '<rootDir>/tests/$1',
  },
  globalSetup: undefined,
  globalTeardown: undefined,
  maxWorkers: process.env.CI ? 2 : '75%', // Optimize for CI vs local development
  testPathIgnorePatterns: [
    '/node_modules/',
    '/coverage/',
    '/dist/'
  ],
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts',
    '!src/app.ts',
    '!src/config/**',
    '!src/types/**'
  ],
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '/tests/',
    '/coverage/'
  ],
};
