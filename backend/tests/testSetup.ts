import { setupRedisMock } from './mocks/redis.mock';
import { setupSendGridMock } from './mocks/sendgrid.mock';
import { TEST_CREDENTIALS } from './testConstants';

// Global test setup - runs once before all tests
export const setupTestEnvironment = () => {
  // Set environment variables
  process.env.NODE_ENV = 'test';
  process.env.JWT_SECRET = TEST_CREDENTIALS.JWT_SECRET;
  process.env.PATIENT_JWT_SECRET = TEST_CREDENTIALS.PATIENT_JWT_SECRET;
  
  // Setup mocks
  const mockRedis = setupRedisMock();
  const mockSendGrid = setupSendGridMock();
  
  return { mockRedis, mockSendGrid };
};

// Common test utilities
export const testUtils = {
  // Fast user creation without database
  createMockUser: (overrides = {}) => ({
    _id: 'user123',
    email: 'test@example.com',
    name: 'Test User',
    role: 'admin',
    save: jest.fn(),
    comparePassword: jest.fn(),
    ...overrides
  }),
  
  // Fast patient creation without database
  createMockPatient: (overrides = {}) => ({
    _id: 'patient123',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    phone: '123-456-7890',
    save: jest.fn(),
    ...overrides
  }),
  
  // Fast appointment creation without database
  createMockAppointment: (overrides = {}) => ({
    _id: 'appt123',
    patient: 'patient123',
    provider: 'provider123',
    scheduledStart: new Date(),
    scheduledEnd: new Date(),
    status: 'scheduled',
    save: jest.fn(),
    ...overrides
  })
};