const express = require('express');
const cors = require('cors');
require('dotenv').config();

const initDatabase = require('./config/initDatabase');
// Initialize models to set up associations
require('./models');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const roleRoutes = require('./routes/roleRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize database (non-blocking - server will start even if DB init fails)
initDatabase()
  .then(() => {
    console.log('✅ Database ready');
  })
  .catch(err => {
    console.error('❌ Database initialization failed:', err.message);
    console.error('💡 The server will start, but database operations may fail.');
    console.error('💡 Please check your database configuration in .env file');
  });

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Full-Stack Application API', version: '1.0.0' });
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/roles', roleRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

module.exports = app;

