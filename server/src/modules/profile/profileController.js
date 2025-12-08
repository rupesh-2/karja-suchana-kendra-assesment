const UserModel = require('../../models/UserModel');
const LogService = require('../../services/logService');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure multer for avatar uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../../../uploads/avatars');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `avatar-${req.user.id}-${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit for avatars
  },
  fileFilter: (req, file, cb) => {
    // Only accept images
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only images are allowed for avatars.'));
    }
  }
}).single('avatar');

const getProfile = async (req, res) => {
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
      roleId: user.role_id,
      avatar: user.avatar,
      createdAt: user.created_at,
      updatedAt: user.updated_at
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Failed to get profile' });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { username, email, password, currentPassword } = req.body;
    const userId = req.user.id;

    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const updateData = {};

    // Update username
    if (username && username !== user.username) {
      const existingUser = await UserModel.findByUsername(username);
      if (existingUser) {
        return res.status(400).json({ error: 'Username already exists' });
      }
      updateData.username = username;
    }

    // Update email
    if (email && email !== user.email) {
      const existingEmail = await UserModel.findByEmail(email);
      if (existingEmail) {
        return res.status(400).json({ error: 'Email already exists' });
      }
      updateData.email = email;
    }

    // Update password (requires current password)
    if (password) {
      if (!currentPassword) {
        return res.status(400).json({ error: 'Current password is required' });
      }

      const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ error: 'Current password is incorrect' });
      }

      updateData.password = await bcrypt.hash(password, 10);
    }

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }

    const updatedUser = await UserModel.update(userId, updateData);

    // Log the profile update
    await LogService.createLog(userId, 'profile_updated', userId, req.ip, req.get('user-agent'), `Updated: ${Object.keys(updateData).join(', ')}`);

    res.json({
      id: updatedUser.id,
      username: updatedUser.username,
      email: updatedUser.email,
      role: updatedUser.role ? updatedUser.role.name : null,
      roleId: updatedUser.role_id,
      avatar: updatedUser.avatar
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
};

const uploadAvatar = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    try {
      const userId = req.user.id;
      const user = await UserModel.findById(userId);
      
      if (!user) {
        // Delete uploaded file if user not found
        fs.unlink(req.file.path, () => {});
        return res.status(404).json({ error: 'User not found' });
      }

      // Delete old avatar if it exists
      if (user.avatar) {
        const oldAvatarPath = path.join(__dirname, '../../../uploads/avatars', path.basename(user.avatar));
        if (fs.existsSync(oldAvatarPath)) {
          fs.unlink(oldAvatarPath, (err) => {
            if (err) console.error('Error deleting old avatar:', err);
          });
        }
      }

      // Save avatar path (relative to uploads directory)
      const avatarPath = `/uploads/avatars/${req.file.filename}`;
      await UserModel.update(userId, { avatar: avatarPath });

      // Log the avatar upload
      await LogService.createLog(userId, 'avatar_uploaded', userId, req.ip, req.get('user-agent'), `Uploaded: ${req.file.originalname}`);

      res.json({
        message: 'Avatar uploaded successfully',
        avatar: avatarPath
      });
    } catch (error) {
      console.error('Upload avatar error:', error);
      // Delete uploaded file if database save fails
      if (req.file) {
        fs.unlink(req.file.path, (unlinkErr) => {
          if (unlinkErr) console.error('Error deleting uploaded file:', unlinkErr);
        });
      }
      res.status(500).json({ error: 'Failed to upload avatar' });
    }
  });
};

module.exports = {
  getProfile,
  updateProfile,
  uploadAvatar
};
