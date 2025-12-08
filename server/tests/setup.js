// Test database configuration
process.env.NODE_ENV = 'test';
process.env.DB_NAME = 'fullstack_app_test';
process.env.DB_HOST = process.env.DB_HOST || 'localhost';
process.env.DB_USER = process.env.DB_USER || 'root';
process.env.DB_PASSWORD = process.env.DB_PASSWORD || '';
process.env.JWT_SECRET = 'test_jwt_secret_key_for_testing_only';
process.env.PORT = '5001';

// Increase timeout for database operations
jest.setTimeout(30000);

// Suppress console logs during tests (optional - comment out if you want to see logs)
// global.console = {
//   ...console,
//   log: jest.fn(),
//   debug: jest.fn(),
//   info: jest.fn(),
//   warn: jest.fn(),
//   error: jest.fn(),
// };
