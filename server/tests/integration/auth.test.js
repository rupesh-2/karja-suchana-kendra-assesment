const request = require('supertest');
const { sequelize, User, Role } = require('../../src/models');
const bcrypt = require('bcryptjs');
const { setupTestDatabase } = require('../helpers/databaseHelper');

// Create a test app instance
let app;

describe('Authentication API Integration Tests', () => {
  let testUser;
  let testRole;

  beforeAll(async () => {
    // Setup test database (creates DB and tables)
    await setupTestDatabase();

    // Import app after database is set up
    app = require('../../src/app');

    // Create test role
    [testRole] = await Role.findOrCreate({
      where: { id: 1 },
      defaults: {
        id: 1,
        name: 'readonly',
        description: 'Test role',
      },
    });

    // Create test user
    const hashedPassword = await bcrypt.hash('TestPassword123!', 10);
    testUser = await User.create({
      username: 'testuser',
      email: 'test@example.com',
      password: hashedPassword,
      role_id: 1,
    });
  }, 30000); // 30 second timeout for setup

  afterAll(async () => {
    // Cleanup
    try {
      if (testUser) {
        await User.destroy({ where: { id: testUser.id }, force: true });
      }
      // Close database connection
      await sequelize.close();
    } catch (error) {
      // Ignore cleanup errors in tests
    }
  });

  describe('POST /api/auth/login', () => {
    it('should login successfully with valid credentials', async () => {
      const response = await request(app).post('/api/auth/login').send({
        username: 'testuser',
        password: 'TestPassword123!',
      });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('user');
      expect(response.body.user.username).toBe('testuser');
    });

    it('should return 401 for invalid credentials', async () => {
      const response = await request(app).post('/api/auth/login').send({
        username: 'testuser',
        password: 'wrongpassword',
      });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error');
    });

    it('should return 400 if credentials are missing', async () => {
      const response = await request(app).post('/api/auth/login').send({});

      expect(response.status).toBe(400);
    });
  });

  describe('GET /api/auth/me', () => {
    let authToken;

    beforeAll(async () => {
      // Get auth token
      const loginResponse = await request(app).post('/api/auth/login').send({
        username: 'testuser',
        password: 'TestPassword123!',
      });
      authToken = loginResponse.body.token;
    });

    it('should return user profile with valid token', async () => {
      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('username');
    });

    it('should return 401 without token', async () => {
      const response = await request(app).get('/api/auth/me');

      expect(response.status).toBe(401);
    });
  });
});
