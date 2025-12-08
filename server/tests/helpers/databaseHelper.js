const { sequelize } = require('../../src/models');

/**
 * Setup test database
 * Creates database if it doesn't exist and syncs all tables
 */
async function setupTestDatabase() {
  try {
    // Try to authenticate
    await sequelize.authenticate();
  } catch (error) {
    if (error.original && error.original.code === 'ER_BAD_DB_ERROR') {
      // Create test database
      const { Sequelize } = require('sequelize');
      const tempSequelize = new Sequelize(
        '',
        process.env.DB_USER || 'root',
        process.env.DB_PASSWORD || '',
        {
          host: process.env.DB_HOST || 'localhost',
          dialect: 'mysql',
          logging: false
        }
      );

      await tempSequelize.query(
        `CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME}\`;`
      );
      await tempSequelize.close();

      // Now authenticate with test database
      await sequelize.authenticate();
    } else {
      throw error;
    }
  }

  // Sync all tables (force: true in test to start fresh)
  await sequelize.sync({ force: true });
}

/**
 * Cleanup test database
 * Closes connection and optionally drops database
 */
async function cleanupTestDatabase(dropDatabase = false) {
  try {
    await sequelize.close();
    
    if (dropDatabase && process.env.NODE_ENV === 'test') {
      const { Sequelize } = require('sequelize');
      const tempSequelize = new Sequelize(
        '',
        process.env.DB_USER || 'root',
        process.env.DB_PASSWORD || '',
        {
          host: process.env.DB_HOST || 'localhost',
          dialect: 'mysql',
          logging: false
        }
      );

      await tempSequelize.query(`DROP DATABASE IF EXISTS \`${process.env.DB_NAME}\`;`);
      await tempSequelize.close();
    }
  } catch (error) {
    console.error('Cleanup error:', error);
  }
}

module.exports = {
  setupTestDatabase,
  cleanupTestDatabase
};

