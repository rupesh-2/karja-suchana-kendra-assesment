const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Initialize models to set up associations (must be before routes)
// Wrap in try-catch to prevent crashes if models fail to load
try {
  require('./models');
} catch (err) {
  console.error('⚠️  Error loading models:', err.message);
  console.error('💡 Server will start, but database operations may fail.');
  console.error('💡 Full error:', err);
}

const initDatabase = require('./config/initDatabase');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const roleRoutes = require('./routes/roleRoutes');
const profileRoutes = require('./modules/profile/profileRoutes');
const logRoutes = require('./modules/logs/logRoutes');
const notificationRoutes = require('./modules/notifications/notificationRoutes');
const uploadRoutes = require('./modules/uploads/uploadRoutes');
const settingsRoutes = require('./modules/settings/settingsRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize database (non-blocking - server will start even if DB init fails)
// Skip database initialization in test environment
if (process.env.NODE_ENV !== 'test') {
  // Delay initialization slightly to ensure server is ready
  setTimeout(() => {
    initDatabase()
      .then(() => {
        console.log('✅ Database ready');
      })
      .catch(err => {
        console.error('❌ Database initialization failed:', err.message);
        console.error('💡 The server will start, but database operations may fail.');
        console.error('💡 Please check your database configuration in .env file');
        console.error('💡 Full error:', err);
      });
  }, 100);
}

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Full-Stack Application API', version: '1.0.0' });
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/roles', roleRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/logs', logRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/settings', settingsRoutes);

// Serve uploaded files
app.use('/uploads', express.static('uploads'));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start server
const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📡 API available at http://localhost:${PORT}/api`);
});

// Handle server errors
server.on('error', err => {
  if (err.code === 'EADDRINUSE') {
    console.error(`❌ Port ${PORT} is already in use. Please use a different port.`);
  } else {
    console.error('❌ Server error:', err);
  }
  process.exit(1);
});

// Handle uncaught exceptions (set up early to catch all errors)
process.on('uncaughtException', err => {
  console.error('❌ Uncaught Exception:', err.message);
  console.error('Stack:', err.stack);
  // Don't exit - let the server try to continue
  // process.exit(1);
});

// Handle unhandled promise rejections (set up early)
process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection:', reason);
  if (reason && reason.stack) {
    console.error('Stack:', reason.stack);
  }
  // Don't exit - let the server try to continue
});

module.exports = app;
