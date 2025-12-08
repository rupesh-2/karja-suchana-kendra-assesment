/**
 * Migration script to add deleted_at column to users table
 * Run this if you get "Unknown column 'deleted_at'" errors
 */

const sequelize = require('../config/sequelize');

async function addDeletedAtColumn() {
  try {
    console.log('🔄 Adding deleted_at column to users table...');
    
    await sequelize.query(`
      ALTER TABLE users 
      ADD COLUMN deleted_at DATETIME NULL DEFAULT NULL 
      AFTER role_id
    `);
    
    console.log('✅ Successfully added deleted_at column');
    process.exit(0);
  } catch (error) {
    if (error.message.includes('Duplicate column name')) {
      console.log('✅ Column deleted_at already exists');
      process.exit(0);
    } else {
      console.error('❌ Error adding column:', error.message);
      process.exit(1);
    }
  }
}

addDeletedAtColumn();

