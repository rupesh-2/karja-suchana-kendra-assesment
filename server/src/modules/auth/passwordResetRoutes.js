const express = require('express');
const router = express.Router();
const passwordResetController = require('./passwordResetController');
const { validateForgotPassword, validateResetPassword } = require('../../middleware/validation');

router.post('/forgot', validateForgotPassword, passwordResetController.forgotPassword);
router.post('/reset', validateResetPassword, passwordResetController.resetPassword);

module.exports = router;

