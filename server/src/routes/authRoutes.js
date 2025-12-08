const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticate } = require('../middleware/auth');
const { validateLogin } = require('../middleware/validation');
const passwordResetRoutes = require('../modules/auth/passwordResetRoutes');

router.post('/login', validateLogin, authController.login);
router.post('/refresh', authController.refreshToken);
router.get('/me', authenticate, authController.getMe);
router.post('/logout', authenticate, authController.logout);

// Password reset routes
router.use('/', passwordResetRoutes);

module.exports = router;

