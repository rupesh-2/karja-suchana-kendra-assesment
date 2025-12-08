const request = require('supertest');
const { sequelize, User, Role } = require('../../src/models');
const bcrypt = require('bcryptjs');

// Create a test app instance
let app;

describe('Authentication API Integration Tests', () => {
  let testUser;
  let testRole;

  beforeAll(async () => {
    // Import app after environment is set
    app = require('../../src/app');

    // Ensure test database exists
    try {
      await sequelize.authenticate();
    } catch (error) {
      if (error.original && error.original.code === 'ER_BAD_DB_ERROR') {
        // Create test database
        const { Sequelize } = require('sequelize');
        const tempSequelize = new Sequelize(
          '',
          process.env.DB_USER || 'root',
          process.env.DB_PASSWORD || '',
          {
            host: process.env.DB_HOST || 'localhost',
            dialect: 'mysql',
            logging: false,
          }
        );

        await tempSequelize.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME};`);
        await tempSequelize.close();

        // Now authenticate with test database
        await sequelize.authenticate();
      } else {
        throw error;
      }
    }

    // Sync database (create tables)
    await sequelize.sync({ force: true });

    // Create test role if it doesn't exist
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
  });

  afterAll(async () => {
    // Cleanup
    try {
      if (testUser) {
        await User.destroy({ where: { id: testUser.id }, force: true });
      }
      // Close database connection
      await sequelize.close();
    } catch (error) {
      console.error('Cleanup error:', error);
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
