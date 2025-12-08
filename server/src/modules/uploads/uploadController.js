const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { File } = require('../../models');
const LogService = require('../../services/logService');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../../../uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Accept images, documents, etc.
    const allowedTypes = /jpeg|jpg|png|gif|pdf|doc|docx|txt/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only images and documents are allowed.'));
    }
  }
}).single('file');

const uploadFile = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    try {
      const userId = req.user.id;
      const fileUrl = `/uploads/${req.file.filename}`;

      const fileRecord = await File.create({
        user_id: userId,
        filename: req.file.filename,
        original_name: req.file.originalname,
        mime_type: req.file.mimetype,
        size: req.file.size,
        path: req.file.path,
        url: fileUrl,
        category: req.body.category || 'general'
      });

      // Log the action
      await LogService.createLog(userId, 'file_uploaded', userId, req);

      res.status(201).json({
        id: fileRecord.id,
        filename: fileRecord.original_name,
        url: fileRecord.url,
        size: fileRecord.size,
        mimeType: fileRecord.mime_type,
        createdAt: fileRecord.created_at
      });
    } catch (error) {
      console.error('Upload file error:', error);
      // Delete uploaded file if database save fails
      if (req.file && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
      res.status(500).json({ error: 'Failed to save file' });
    }
  });
};

const getFiles = async (req, res) => {
  try {
    const userId = req.user.id;
    const isSuperAdmin = req.user.role_name === 'superadmin';

    // Super Admin can see all files, others only their own
    const where = isSuperAdmin ? {} : { user_id: userId };

    const files = await File.findAll({
      where,
      include: [{
        model: require('../../models').User,
        as: 'user',
        attributes: ['id', 'username', 'email']
      }],
      order: [['created_at', 'DESC']]
    });

    res.json(files);
  } catch (error) {
    console.error('Get files error:', error);
    res.status(500).json({ error: 'Failed to fetch files' });
  }
};

const deleteFile = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const isSuperAdmin = req.user.role_name === 'superadmin';

    const file = await File.findByPk(id);

    if (!file) {
      return res.status(404).json({ error: 'File not found' });
    }

    // Check permissions
    if (!isSuperAdmin && file.user_id !== userId) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    // Delete physical file
    if (fs.existsSync(file.path)) {
      fs.unlinkSync(file.path);
    }

    // Delete database record
    await file.destroy();

    // Log the action
    await LogService.createLog(userId, 'file_deleted', userId, req);

    res.json({ message: 'File deleted successfully' });
  } catch (error) {
    console.error('Delete file error:', error);
    res.status(500).json({ error: 'Failed to delete file' });
  }
};

module.exports = {
  uploadFile,
  getFiles,
  deleteFile
};

