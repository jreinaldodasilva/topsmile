import mongoose from 'mongoose';

beforeAll(async () => {
  console.log('Setting up test database...');
  // Set JWT_SECRET for tests if not already set
  if (!process.env.JWT_SECRET) {
    process.env.JWT_SECRET = 'test-jwt-secret-key';
  }

  // Connect to the local MongoDB instance
  const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/test-db';
  console.log('Connecting to MongoDB at:', mongoUri);

  // Connect to the database
  await mongoose.connect(mongoUri);
  console.log('Connected to test database');
});

afterAll(async () => {
  // Close database connection
  await mongoose.disconnect();
  console.log('Disconnected from test database');
});

afterEach(async () => {
  // Clear all collections after each test
  const collections = mongoose.connection.collections;

  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany({});
  }
});
