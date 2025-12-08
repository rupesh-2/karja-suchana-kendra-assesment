const express = require('express');
const router = express.Router();
const settingsController = require('./settingsController');
const { authenticate, authorize } = require('../../middleware/auth');

// All routes require authentication and Super Admin role
router.use(authenticate);
router.use(authorize('superadmin'));

router.get('/', settingsController.getAllSettings);
router.get('/:key', settingsController.getSetting);
router.put('/:key', settingsController.updateSetting);
router.put('/', settingsController.updateMultipleSettings);

module.exports = router;

