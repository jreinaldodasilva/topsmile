const baseConfig = require('./jest.config.js');

module.exports = {
  ...baseConfig,
  maxWorkers: '100%',
  testTimeout: 30000,
  
  // Parallel-optimized settings
  setupFilesAfterEnv: ['<rootDir>/tests/setup.parallel.ts'],
  
  // Test sharding for large test suites
  projects: [
    {
      ...baseConfig,
      displayName: 'unit',
      testMatch: ['**/tests/unit/**/*.test.ts'],
      maxWorkers: 4,
    },
    {
      ...baseConfig,
      displayName: 'security',
      testMatch: ['**/tests/security/**/*.test.ts'],
      maxWorkers: 2,
    },
    {
      ...baseConfig,
      displayName: 'compliance',
      testMatch: ['**/tests/compliance/**/*.test.ts'],
      maxWorkers: 2,
    },
    {
      ...baseConfig,
      displayName: 'payments',
      testMatch: ['**/tests/payments/**/*.test.ts'],
      maxWorkers: 2,
    }
  ]
};