const express = require('express');
const router = express.Router();
const passwordResetController = require('./passwordResetController');

router.post('/forgot', passwordResetController.forgotPassword);
router.post('/reset', passwordResetController.resetPassword);

module.exports = router;

