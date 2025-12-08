const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authController = require('../../src/controllers/authController');
const UserModel = require('../../src/models/UserModel');
const LogService = require('../../src/services/logService');

// Mock dependencies
jest.mock('../../src/models/UserModel');
jest.mock('../../src/services/logService');

describe('Auth Controller', () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {},
      user: { id: 1, username: 'testuser', role_name: 'admin' }
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('login', () => {
    it('should login successfully with valid credentials', async () => {
      req.body = { username: 'testuser', password: 'password123' };
      
      const mockUser = {
        id: 1,
        username: 'testuser',
        email: 'test@example.com',
        password: await bcrypt.hash('password123', 10),
        role: { name: 'admin' },
        role_id: 2
      };

      UserModel.findByUsername.mockResolvedValue(mockUser);
      LogService.createLog.mockResolvedValue(null);

      await authController.login(req, res);

      expect(UserModel.findByUsername).toHaveBeenCalledWith('testuser');
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          token: expect.any(String),
          user: expect.objectContaining({
            id: 1,
            username: 'testuser'
          })
        })
      );
    });

    it('should return 401 for invalid credentials', async () => {
      req.body = { username: 'testuser', password: 'wrongpassword' };
      
      UserModel.findByUsername.mockResolvedValue({
        id: 1,
        username: 'testuser',
        password: await bcrypt.hash('password123', 10)
      });

      await authController.login(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ error: 'Invalid credentials' });
    });

    it('should return 400 if username or password is missing', async () => {
      req.body = { username: 'testuser' };

      await authController.login(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ 
        error: 'Username and password are required' 
      });
    });
  });

  describe('getMe', () => {
    it('should return current user profile', async () => {
      const mockUser = {
        id: 1,
        username: 'testuser',
        email: 'test@example.com',
        role: { name: 'admin' },
        role_id: 2
      };

      UserModel.findById.mockResolvedValue(mockUser);

      await authController.getMe(req, res);

      expect(UserModel.findById).toHaveBeenCalledWith(1);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 1,
          username: 'testuser',
          email: 'test@example.com'
        })
      );
    });

    it('should return 404 if user not found', async () => {
      UserModel.findById.mockResolvedValue(null);

      await authController.getMe(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'User not found' });
    });
  });
});

