const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const UserModel = require('../models/UserModel');
const { RefreshToken } = require('../models');
const LogService = require('../services/logService');

const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ 
        error: 'Invalid credentials',
        message: 'Username and password are required' 
      });
    }

    // Always perform password comparison to prevent timing attacks
    // Use a dummy hash comparison if user doesn't exist
    const user = await UserModel.findByUsername(username);
    const dummyHash = '$2a$10$dummyhashforsecuritypurposesonly1234567890123456789012';
    const providedHash = user ? user.password : dummyHash;
    
    // Perform password comparison (always takes same time regardless of user existence)
    const isPasswordValid = await bcrypt.compare(password, providedHash);

    // Security: Don't reveal if user exists or not
    // Return same error message for both invalid user and invalid password
    if (!user || !isPasswordValid) {
      // Log failed login attempt (without revealing if user exists)
      if (user) {
        await LogService.createLog(
          user.id, 
          'login_failed', 
          user.id, 
          req.ip || req.connection?.remoteAddress, 
          `Failed login attempt from ${req.get('user-agent') || 'Unknown'}`
        );
      }
      
      return res.status(401).json({ 
        error: 'Invalid credentials',
        message: 'The username or password you entered is incorrect. Please try again.' 
      });
    }

    // Check if user is soft deleted (only check if user exists and password is valid)
    if (user.deleted_at) {
      await LogService.createLog(
        user.id, 
        'login_blocked_deleted', 
        user.id, 
        req.ip || req.connection?.remoteAddress, 
        `Login attempt blocked - account deactivated`
      );
      
      return res.status(401).json({ 
        error: 'Account deactivated',
        message: 'This account has been deactivated. Please contact an administrator for assistance.' 
      });
    }

    const roleName = user.role ? user.role.name : null;
    
    // Generate access token (short-lived: 15 minutes)
    const accessToken = jwt.sign(
      { userId: user.id, username: user.username, role: roleName, type: 'access' },
      process.env.JWT_SECRET,
      { expiresIn: process.env.ACCESS_TOKEN_EXPIRY || '15m' }
    );

    // Generate refresh token (long-lived: 7 days)
    const refreshTokenValue = crypto.randomBytes(64).toString('hex');
    const refreshTokenExpiry = new Date();
    refreshTokenExpiry.setDate(refreshTokenExpiry.getDate() + 7); // 7 days

    // Save refresh token to database
    await RefreshToken.create({
      user_id: user.id,
      token: refreshTokenValue,
      expires_at: refreshTokenExpiry,
      ip_address: req.ip || req.connection.remoteAddress,
      user_agent: req.get('user-agent')
    });

    // Log login action
    await LogService.createLog(user.id, 'user_login', user.id, req.ip, `Login from ${req.get('user-agent')}`);

    res.json({
      accessToken,
      refreshToken: refreshTokenValue,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role ? user.role.name : null,
        roleId: user.role_id
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    
    // Handle database schema errors gracefully
    if (error.name === 'SequelizeDatabaseError' && error.message.includes('deleted_at')) {
      console.error('⚠️  Database schema needs update. Please restart the server to sync schema.');
      return res.status(500).json({ 
        error: 'System error',
        message: 'The system is currently being updated. Please try again in a moment.' 
      });
    }
    
    // Generic error message for security (don't reveal system details)
    res.status(500).json({ 
      error: 'Login failed',
      message: 'An error occurred during login. Please try again later.' 
    });
  }
};

const getMe = async (req, res) => {
  try {
      const user = await UserModel.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role ? user.role.name : null,
      roleId: user.role_id
    });
  } catch (error) {
    console.error('Get me error:', error);
    res.status(500).json({ error: 'Failed to get user' });
  }
};

const refreshToken = async (req, res) => {
  try {
    const { refreshToken: token } = req.body;

    if (!token) {
      return res.status(400).json({ error: 'Refresh token is required' });
    }

    // Find refresh token in database
    const refreshTokenRecord = await RefreshToken.findOne({
      where: { token, revoked: false },
      include: [{ model: require('../models').User, as: 'user', include: [{ model: require('../models').Role, as: 'role' }] }]
    });

    if (!refreshTokenRecord) {
      return res.status(401).json({ error: 'Invalid refresh token' });
    }

    // Check if token is expired
    if (new Date() > refreshTokenRecord.expires_at) {
      await refreshTokenRecord.update({ revoked: true, revoked_at: new Date() });
      return res.status(401).json({ error: 'Refresh token expired' });
    }

    // Check if user is soft deleted
    if (refreshTokenRecord.user.deleted_at) {
      await refreshTokenRecord.update({ revoked: true, revoked_at: new Date() });
      return res.status(401).json({ error: 'Account has been deactivated' });
    }

    const user = refreshTokenRecord.user;
    const roleName = user.role ? user.role.name : null;

    // Generate new access token
    const accessToken = jwt.sign(
      { userId: user.id, username: user.username, role: roleName, type: 'access' },
      process.env.JWT_SECRET,
      { expiresIn: process.env.ACCESS_TOKEN_EXPIRY || '15m' }
    );

    res.json({
      accessToken
    });
  } catch (error) {
    console.error('Refresh token error:', error);
    res.status(500).json({ error: 'Failed to refresh token' });
  }
};

const logout = async (req, res) => {
  try {
    const { refreshToken: token } = req.body;

    if (token) {
      // Revoke refresh token
      const refreshTokenRecord = await RefreshToken.findOne({ where: { token } });
      if (refreshTokenRecord) {
        await refreshTokenRecord.update({ revoked: true, revoked_at: new Date() });
      }
    }

    // Log logout action
    if (req.user) {
      await LogService.createLog(req.user.id, 'user_logout', req.user.id, req.ip);
    }

    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ error: 'Logout failed' });
  }
};

module.exports = {
  login,
  getMe,
  refreshToken,
  logout
};

