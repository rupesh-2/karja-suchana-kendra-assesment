const crypto = require('crypto');
const UserModel = require('../../models/UserModel');
const { PasswordReset, User } = require('../../models');
const bcrypt = require('bcryptjs');
const LogService = require('../../services/logService');

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const user = await UserModel.findByEmail(email);
    
    // Don't reveal if email exists or not (security best practice)
    if (!user) {
      return res.json({ 
        message: 'If the email exists, a password reset link has been sent.' 
      });
    }

    // Generate reset token
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1); // Token expires in 1 hour

    // Delete any existing reset tokens for this user
    await PasswordReset.destroy({ where: { user_id: user.id } });

    // Create new reset token
    await PasswordReset.create({
      user_id: user.id,
      token,
      expires_at: expiresAt
    });

    // Log the action
    await LogService.createLog(user.id, 'password_reset_requested', user.id, req);

    // TODO: Send email with reset link
    // For now, return token in development (remove in production!)
    if (process.env.NODE_ENV === 'development') {
      console.log(`Password reset token for ${email}: ${token}`);
      return res.json({ 
        message: 'Password reset token generated (check console in development)',
        token: token // Remove this in production!
      });
    }

    res.json({ 
      message: 'If the email exists, a password reset link has been sent.' 
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ error: 'Failed to process password reset request' });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({ error: 'Token and new password are required' });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters long' });
    }

    // Find valid reset token
    const resetToken = await PasswordReset.findOne({
      where: { 
        token,
        used: false
      }
    });

    if (!resetToken) {
      return res.status(400).json({ error: 'Invalid or expired reset token' });
    }

    // Check if token has expired
    if (new Date() > new Date(resetToken.expires_at)) {
      await resetToken.update({ used: true });
      return res.status(400).json({ error: 'Reset token has expired' });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update user password
    await UserModel.update(resetToken.user_id, { password: hashedPassword });

    // Mark token as used
    await resetToken.update({ used: true });

    // Log the action
    await LogService.createLog(resetToken.user_id, 'password_reset_completed', resetToken.user_id, req);

    res.json({ message: 'Password has been reset successfully' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ error: 'Failed to reset password' });
  }
};

module.exports = {
  forgotPassword,
  resetPassword
};

