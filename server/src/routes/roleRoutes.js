const express = require('express');
const router = express.Router();
const roleController = require('../controllers/roleController');
const { authenticate, authorize, checkPermission } = require('../middleware/auth');

// All routes require authentication
router.use(authenticate);

// Get all roles
router.get('/', checkPermission('view_roles'), roleController.getAllRoles);

// Get role by ID
router.get('/:id', checkPermission('view_roles'), roleController.getRoleById);

// Create role - Super Admin only
router.post('/', authorize('superadmin'), roleController.createRole);

// Update role - Super Admin only
router.put('/:id', authorize('superadmin'), roleController.updateRole);

// Delete role - Super Admin only
router.delete('/:id', authorize('superadmin'), roleController.deleteRole);

module.exports = router;

