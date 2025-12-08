const express = require('express');
const router = express.Router();
const uploadController = require('./uploadController');
const { authenticate } = require('../../middleware/auth');

// All routes require authentication
router.use(authenticate);

router.post('/upload', uploadController.uploadFile);
router.get('/files', uploadController.getFiles);
router.delete('/files/:id', uploadController.deleteFile);

module.exports = router;

