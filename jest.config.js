const defaultConfig = require('react-scripts/scripts/utils/createJestConfig')(
  (p) => require.resolve('react-scripts/config/jest/babelTransform.js'),
  __dirname,
  false
);

module.exports = {
  ...defaultConfig,

  reporters: [
    'default',
    ['jest-junit', {
      outputDirectory: './reports',
      outputName: 'junit-frontend.xml',
    }],
  ],

  setupFiles: [
    '<rootDir>/src/textEncoderPolyfill.js',
    '<rootDir>/src/jest-pre-setup.ts',
    '<rootDir>/src/transformStreamPolyfill.js',
    '<rootDir>/src/msw-polyfills.js'
  ],

  setupFilesAfterEnv: [
    ...defaultConfig.setupFilesAfterEnv,
    '<rootDir>/src/setupTests.ts'
  ],

  moduleNameMapper: {
    ...defaultConfig.moduleNameMapper,
    '^@topsmile/types$': '<rootDir>/../packages/types/src',
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@components/(.*)$': '<rootDir>/src/components/$1',
    '^@contexts/(.*)$': '<rootDir>/src/contexts/$1',
    '^@hooks/(.*)$': '<rootDir>/src/hooks/$1',
    '^@pages/(.*)$': '<rootDir>/src/pages/$1',
    '^@services/(.*)$': '<rootDir>/src/services/$1',
    '^@types/(.*)$': '<rootDir>/src/types/$1',
    '^@utils/(.*)$': '<rootDir>/src/utils/$1',
    '^@assets/(.*)$': '<rootDir>/src/assets/$1',
    '^@styles/(.*)$': '<rootDir>/src/styles/$1',
    '^@tests/(.*)$': '<rootDir>/src/tests/$1',
    '\\.(css|scss|sass)$': 'identity-obj-proxy',
  },

  collectCoverageFrom: [
    'src/**/*.(ts|tsx)',
    '!src/**/*.d.ts',
    '!src/index.tsx',
    '!src/reportWebVitals.ts',
    '!src/setupTests.ts',
    '!src/react-app-env.d.ts',
    '!src/tests/**',
    '!src/assets/**',
  ],

  coverageDirectory: 'coverage/frontend',
  coverageReporters: ['text', 'lcov', 'html', 'json'],

  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },

  testTimeout: 8000,
  clearMocks: true,
  restoreMocks: true,
  detectOpenHandles: false,
  verbose: false,
  bail: 1,
  cache: true,
  testEnvironment: 'jsdom',

  transformIgnorePatterns: [
    '/node_modules/(?!(@bundled-es-modules/|msw/))'
  ],
};
