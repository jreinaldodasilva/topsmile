import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import './customMatchers';
import '../src/models/Provider';
import { tokenBlacklistService } from '../src/services/tokenBlacklistService';
import { setupRedisMock } from './mocks/redis.mock';
import { setupSendGridMock } from './mocks/sendgrid.mock';
import { TEST_CREDENTIALS } from './testConstants';

let mongoServer: MongoMemoryServer;
let mockRedisClient: any;
let mockSendGridClient: any;

beforeAll(async () => {
  console.log('Setting up test database with MongoDB Memory Server...');
  
  // Set JWT secrets from test constants
  process.env.JWT_SECRET = TEST_CREDENTIALS.JWT_SECRET;
  process.env.PATIENT_JWT_SECRET = TEST_CREDENTIALS.PATIENT_JWT_SECRET;
  
  // Setup mocks
  mockRedisClient = setupRedisMock();
  mockSendGridClient = setupSendGridMock();

  // Start MongoDB Memory Server for test isolation
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  console.log('Connecting to MongoDB Memory Server at:', mongoUri);

  // Connect to the in-memory database
  await mongoose.connect(mongoUri);
  console.log('Connected to test database');
});

afterAll(async () => {
  // Close database connection
  await mongoose.disconnect();
  console.log('Disconnected from test database');

  // Stop MongoDB Memory Server
  if (mongoServer) {
    await mongoServer.stop();
    console.log('MongoDB Memory Server stopped');
  }

  // Clean up mocks
  if (mockRedisClient) {
    mockRedisClient.clear();
  }
  if (mockSendGridClient) {
    mockSendGridClient.clear();
  }
});

afterEach(async () => {
  try {
    // Clear the Redis blacklist
    await tokenBlacklistService.clear();
  } catch (error) {
    console.warn('Failed to clear token blacklist:', error);
  }

  // Clear mock data
  if (mockRedisClient) {
    mockRedisClient.clear();
  }
  if (mockSendGridClient) {
    mockSendGridClient.clear();
  }

  // Clear all collections after each test, but only if connected
  if (mongoose.connection.readyState === 1) {
    const collections = mongoose.connection.collections;

    for (const key in collections) {
      const collection = collections[key];
      if (collection) {
        try {
          await collection.deleteMany({});
        } catch (error) {
          // Ignore cleanup errors if database is disconnected
          console.warn(`Failed to clean collection ${key}:`, error);
        }
      }
    }
  }
});
