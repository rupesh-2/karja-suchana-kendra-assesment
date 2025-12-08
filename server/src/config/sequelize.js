const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME || 'fullstack_app',
  process.env.DB_USER || 'root',
  process.env.DB_PASSWORD || '',
  {
    host: process.env.DB_HOST || 'localhost',
    dialect: 'mysql',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  }
);

// Test connection (non-blocking, won't crash server)
// Skip in test environment to avoid logging after tests complete
if (process.env.NODE_ENV !== 'test') {
  // Wrap in try-catch to prevent any synchronous errors from crashing
  try {
    sequelize
      .authenticate()
      .then(() => {
        console.log('✅ Database connection established successfully');
      })
      .catch(err => {
        // Only log, don't throw - server should start anyway
        console.error('⚠️  Initial database connection check failed:', err.message);
        console.error('💡 This is normal if MySQL is not running yet.');
        console.error('💡 The server will start and retry during initialization.');
      });
  } catch (err) {
    // Catch any synchronous errors
    console.error('⚠️  Database configuration error:', err.message);
    console.error('💡 Server will continue to start, but database may not work.');
  }
}

module.exports = sequelize;
