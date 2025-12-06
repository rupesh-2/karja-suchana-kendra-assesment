const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticate, authorize, checkPermission } = require('../middleware/auth');

// All routes require authentication
router.use(authenticate);

// Get all users - Admin and Super Admin only
router.get('/', checkPermission('view_users'), userController.getAllUsers);

// Get user by ID
router.get('/:id', checkPermission('view_users'), userController.getUserById);

// Create user - Admin and Super Admin only
router.post('/', checkPermission('create_users'), userController.createUser);

// Update user - Admin and Super Admin only
router.put('/:id', checkPermission('edit_users'), userController.updateUser);

// Delete user - Super Admin only
router.delete('/:id', authorize('superadmin'), userController.deleteUser);

module.exports = router;

