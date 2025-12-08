const { sequelize, User, Role, Permission, RolePermission } = require('../models');
const bcrypt = require('bcryptjs');

async function initDatabase() {
  try {
    // First, ensure database exists by trying to connect
    try {
      await sequelize.authenticate();
      console.log('✅ Connected to database');
    } catch (authError) {
      // If database doesn't exist, try to create it
      if (authError.original && authError.original.code === 'ER_BAD_DB_ERROR') {
        console.log('📦 Database does not exist. Creating database...');
        // Connect to MySQL server without specifying database
        const { Sequelize } = require('sequelize');
        const tempSequelize = new Sequelize(
          '',
          process.env.DB_USER || 'root',
          process.env.DB_PASSWORD || '',
          {
            host: process.env.DB_HOST || 'localhost',
            dialect: 'mysql',
            logging: false,
          }
        );

        try {
          await tempSequelize.authenticate();
          console.log('✅ Connected to MySQL server');

          const dbName = process.env.DB_NAME || 'fullstack_app';
          await tempSequelize.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\`;`);
          console.log(`✅ Database '${dbName}' created successfully`);

          await tempSequelize.close();

          // Now authenticate with the actual database
          await sequelize.authenticate();
          console.log('✅ Connected to database');
        } catch (createError) {
          console.error('❌ Failed to create database:', createError.message);
          throw createError;
        }
      } else {
        // Other connection errors (MySQL not running, wrong credentials, etc.)
        console.error('❌ Database connection error:', authError.message);
        throw authError;
      }
    }

    // Sync all models (create tables if they don't exist, alter existing tables to add new columns)
    await sequelize.sync({ alter: true });
    console.log('✅ Database tables synchronized');

    // Create default roles
    const [readonlyRole, readonlyCreated] = await Role.findOrCreate({
      where: { id: 1 },
      defaults: {
        id: 1,
        name: 'readonly',
        description: 'Read-Only Role: Users can only view application content',
      },
    });

    const [adminRole, adminCreated] = await Role.findOrCreate({
      where: { id: 2 },
      defaults: {
        id: 2,
        name: 'admin',
        description: 'Admin Role: Users have administrative privileges',
      },
    });

    const [superadminRole, superadminCreated] = await Role.findOrCreate({
      where: { id: 3 },
      defaults: {
        id: 3,
        name: 'superadmin',
        description: 'Super Administrator Role: Users have full access and control',
      },
    });

    // Create default permissions
    const permissionsData = [
      { id: 1, name: 'view_users', description: 'View users list' },
      { id: 2, name: 'create_users', description: 'Create new users' },
      { id: 3, name: 'edit_users', description: 'Edit existing users' },
      { id: 4, name: 'delete_users', description: 'Delete users' },
      { id: 5, name: 'view_roles', description: 'View roles list' },
      { id: 6, name: 'create_roles', description: 'Create new roles' },
      { id: 7, name: 'edit_roles', description: 'Edit existing roles' },
      { id: 8, name: 'delete_roles', description: 'Delete roles' },
      { id: 9, name: 'view_dashboard', description: 'View dashboard' },
      { id: 10, name: 'view_pages', description: 'View all pages' },
    ];

    for (const permData of permissionsData) {
      await Permission.findOrCreate({
        where: { id: permData.id },
        defaults: permData,
      });
    }

    // Get all permissions
    const allPermissions = await Permission.findAll();

    // Assign permissions to roles
    // Read-Only: Only view permissions
    const readonlyPermissions = allPermissions.filter(p => [1, 5, 9, 10].includes(p.id));
    await readonlyRole.setPermissions(readonlyPermissions);

    // Admin: View, create, edit users; view roles
    const adminPermissions = allPermissions.filter(p => [1, 2, 3, 5, 9, 10].includes(p.id));
    await adminRole.setPermissions(adminPermissions);

    // Super Admin: All permissions
    await superadminRole.setPermissions(allPermissions);

    // Create default users if they don't exist
    const userCount = await User.count();

    if (userCount === 0) {
      const hashedSuperAdmin = await bcrypt.hash('SuperAdmin123!', 10);
      const hashedAdmin = await bcrypt.hash('Admin123!', 10);
      const hashedReadOnly = await bcrypt.hash('ReadOnly123!', 10);

      await User.bulkCreate([
        {
          username: 'superadmin',
          email: 'superadmin@example.com',
          password: hashedSuperAdmin,
          role_id: 3,
        },
        {
          username: 'admin',
          email: 'admin@example.com',
          password: hashedAdmin,
          role_id: 2,
        },
        {
          username: 'readonly',
          email: 'readonly@example.com',
          password: hashedReadOnly,
          role_id: 1,
        },
      ]);

      console.log('✅ Default users created');
    }

    console.log('✅ Database initialized successfully');
  } catch (error) {
    console.error('❌ Database initialization error:', error.message);
    if (error.name === 'SequelizeAccessDeniedError') {
      console.error('💡 Database access denied. Check your username and password in .env');
    } else if (
      error.name === 'SequelizeDatabaseError' &&
      error.message.includes('Unknown database')
    ) {
      console.error('💡 Database does not exist. Please create it first:');
      console.error(`   CREATE DATABASE ${process.env.DB_NAME || 'fullstack_app'};`);
    } else if (error.name === 'SequelizeConnectionError') {
      console.error('💡 Cannot connect to MySQL. Make sure MySQL is running.');
    }
    throw error;
  }
}

module.exports = initDatabase;
