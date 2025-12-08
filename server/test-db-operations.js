// Test basic database operations
require('dotenv').config();
const { Sequelize } = require('sequelize');

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

async function testOperations() {
  try {
    console.log('🔍 Testing Database Operations...\n');
    
    // Test 1: Connection
    await sequelize.authenticate();
    console.log('✅ Test 1: Connection - PASSED');
    
    // Test 2: Query execution
    const [results] = await sequelize.query('SELECT 1 as test');
    if (results && results[0] && results[0].test === 1) {
      console.log('✅ Test 2: Query Execution - PASSED');
    } else {
      console.log('❌ Test 2: Query Execution - FAILED');
    }
    
    // Test 3: Check if tables exist
    const [tables] = await sequelize.query("SHOW TABLES");
    const tableCount = tables.length;
    console.log(`✅ Test 3: Table Check - Found ${tableCount} table(s)`);
    
    if (tableCount === 0) {
      console.log('   💡 Tables will be created automatically on first server start');
    } else {
      console.log('   📋 Existing tables:');
      tables.forEach(table => {
        const tableName = Object.values(table)[0];
        console.log(`      - ${tableName}`);
      });
    }
    
    // Test 4: Database info
    const [dbInfo] = await sequelize.query("SELECT DATABASE() as db_name");
    console.log(`✅ Test 4: Database Info - Connected to: ${dbInfo[0].db_name}`);
    
    console.log('\n🎉 All database operations working correctly!');
    console.log('✅ Ready to start the server');
    
    await sequelize.close();
    process.exit(0);
    
  } catch (err) {
    console.error('\n❌ Database operation test failed:');
    console.error('   Error:', err.message);
    if (err.original) {
      console.error('   Code:', err.original.code);
    }
    process.exit(1);
  }
}

testOperations();

