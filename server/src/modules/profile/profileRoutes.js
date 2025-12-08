const express = require('express');
const router = express.Router();
const profileController = require('./profileController');
const { authenticate } = require('../../middleware/auth');

// All routes require authentication
router.use(authenticate);

router.get('/me', profileController.getProfile);
router.put('/update', profileController.updateProfile);

module.exports = router;

