// Parallel test setup with enhanced isolation
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import './customMatchers';
import '../src/models/Provider';
import { tokenBlacklistService } from '../src/services/tokenBlacklistService';
import { setupRedisMock } from './mocks/redis.mock';
import { setupSendGridMock } from './mocks/sendgrid.mock';
import { TEST_CREDENTIALS } from './testConstants';
process.env.JWT_SECRET = TEST_CREDENTIALS.JWT_SECRET;
process.env.PATIENT_JWT_SECRET = TEST_CREDENTIALS.PATIENT_JWT_SECRET;
process.env.NODE_ENV = 'test';
let mongoServer: MongoMemoryServer;
let mockRedisClient: any;
let mockSendGridClient: any;

// Generate unique database name for each worker
const getWorkerDbName = () => {
  const workerId = process.env.JEST_WORKER_ID || '1';
  return `topsmile_test_worker_${workerId}_${Date.now()}`;
};

beforeAll(async () => {
  // Setup mocks
  mockRedisClient = setupRedisMock();
  mockSendGridClient = setupSendGridMock();

  // Start MongoDB Memory Server with worker-specific database
  mongoServer = await MongoMemoryServer.create({
    instance: {
      dbName: getWorkerDbName()
    }
  });
  
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);
}, 30000);

afterAll(async () => {
  await mongoose.disconnect();
  
  if (mongoServer) {
    await mongoServer.stop();
  }

  if (mockRedisClient) {
    mockRedisClient.clear();
  }
  if (mockSendGridClient) {
    mockSendGridClient.clear();
  }
}, 30000);

afterEach(async () => {
  try {
    await tokenBlacklistService.clear();
  } catch (error) {
    // Ignore cleanup errors in parallel tests
  }

  if (mockRedisClient) {
    mockRedisClient.clear();
  }
  if (mockSendGridClient) {
    mockSendGridClient.clear();
  }

  if (mongoose.connection.readyState === 1) {
    const collections = Object.values(mongoose.connection.collections);
    await Promise.all(
      collections.map(collection => 
        collection.deleteMany({}).catch(() => {})
      )
    );
  }
});