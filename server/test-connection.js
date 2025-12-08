// Quick test script to check MySQL connection
require('dotenv').config();
const { Sequelize } = require('sequelize');

console.log('🔍 Testing MySQL Connection...\n');
console.log('Configuration:');
console.log('  Host:', process.env.DB_HOST || 'localhost');
console.log('  User:', process.env.DB_USER || 'root');
console.log('  Password:', process.env.DB_PASSWORD ? '***' : '(empty)');
console.log('  Database:', process.env.DB_NAME || 'fullstack_app');
console.log('');

const sequelize = new Sequelize(
  process.env.DB_NAME || 'fullstack_app',
  process.env.DB_USER || 'root',
  process.env.DB_PASSWORD || '',
  {
    host: process.env.DB_HOST || 'localhost',
    dialect: 'mysql',
    logging: false
  }
);

sequelize.authenticate()
  .then(() => {
    console.log('✅ SUCCESS: Connected to MySQL!');
    console.log('✅ Database is accessible');
    process.exit(0);
  })
  .catch(err => {
    console.error('❌ FAILED: Cannot connect to MySQL');
    console.error('\nError details:');
    console.error('  Message:', err.message);
    if (err.original) {
      console.error('  Code:', err.original.code);
      console.error('  SQL State:', err.original.sqlState);
    }
    
    console.error('\n💡 Troubleshooting:');
    if (err.original && err.original.code === 'ECONNREFUSED') {
      console.error('  → MySQL server is not running');
      console.error('  → Start MySQL service: net start MySQL80');
      console.error('  → Or start XAMPP MySQL from Control Panel');
    } else if (err.original && err.original.code === 'ER_ACCESS_DENIED_ERROR') {
      console.error('  → Wrong username or password');
      console.error('  → Check your .env file');
    } else if (err.original && err.original.code === 'ER_BAD_DB_ERROR') {
      console.error('  → Database does not exist');
      console.error('  → Database will be created automatically on first run');
    } else {
      console.error('  → Check if MySQL is installed and running');
      console.error('  → Verify .env file configuration');
    }
    
    process.exit(1);
  });

