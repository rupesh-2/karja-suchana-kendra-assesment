// Test database configuration
process.env.NODE_ENV = 'test';
process.env.DB_NAME = 'fullstack_app_test';
process.env.JWT_SECRET = 'test_jwt_secret_key_for_testing_only';
process.env.PORT = '5001';

// Increase timeout for database operations
jest.setTimeout(30000);

