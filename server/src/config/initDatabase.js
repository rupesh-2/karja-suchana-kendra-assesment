const pool = require('./database');
const bcrypt = require('bcryptjs');

async function initDatabase() {
  try {
    // Create tables
    await pool.query(`
      CREATE TABLE IF NOT EXISTS roles (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(50) UNIQUE NOT NULL,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS permissions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) UNIQUE NOT NULL,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS role_permissions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        role_id INT NOT NULL,
        permission_id INT NOT NULL,
        FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
        FOREIGN KEY (permission_id) REFERENCES permissions(id) ON DELETE CASCADE,
        UNIQUE KEY unique_role_permission (role_id, permission_id)
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role_id INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (role_id) REFERENCES roles(id)
      )
    `);

    // Insert default roles
    await pool.query(`
      INSERT IGNORE INTO roles (id, name, description) VALUES
      (1, 'readonly', 'Read-Only Role: Users can only view application content'),
      (2, 'admin', 'Admin Role: Users have administrative privileges'),
      (3, 'superadmin', 'Super Administrator Role: Users have full access and control')
    `);

    // Insert default permissions
    await pool.query(`
      INSERT IGNORE INTO permissions (id, name, description) VALUES
      (1, 'view_users', 'View users list'),
      (2, 'create_users', 'Create new users'),
      (3, 'edit_users', 'Edit existing users'),
      (4, 'delete_users', 'Delete users'),
      (5, 'view_roles', 'View roles list'),
      (6, 'create_roles', 'Create new roles'),
      (7, 'edit_roles', 'Edit existing roles'),
      (8, 'delete_roles', 'Delete roles'),
      (9, 'view_dashboard', 'View dashboard'),
      (10, 'view_pages', 'View all pages')
    `);

    // Assign permissions to roles
    // Read-Only: Only view permissions
    await pool.query(`
      INSERT IGNORE INTO role_permissions (role_id, permission_id) VALUES
      (1, 1), (1, 5), (1, 9), (1, 10)
    `);

    // Admin: View, create, edit users; view roles
    await pool.query(`
      INSERT IGNORE INTO role_permissions (role_id, permission_id) VALUES
      (2, 1), (2, 2), (2, 3), (2, 5), (2, 9), (2, 10)
    `);

    // Super Admin: All permissions
    await pool.query(`
      INSERT IGNORE INTO role_permissions (role_id, permission_id) VALUES
      (3, 1), (3, 2), (3, 3), (3, 4), (3, 5), (3, 6), (3, 7), (3, 8), (3, 9), (3, 10)
    `);

    // Create default users if they don't exist
    const [users] = await pool.query('SELECT COUNT(*) as count FROM users');
    
    if (users[0].count === 0) {
      const hashedSuperAdmin = await bcrypt.hash('SuperAdmin123!', 10);
      const hashedAdmin = await bcrypt.hash('Admin123!', 10);
      const hashedReadOnly = await bcrypt.hash('ReadOnly123!', 10);

      await pool.query(`
        INSERT INTO users (username, email, password, role_id) VALUES
        ('superadmin', 'superadmin@example.com', ?, 3),
        ('admin', 'admin@example.com', ?, 2),
        ('readonly', 'readonly@example.com', ?, 1)
      `, [hashedSuperAdmin, hashedAdmin, hashedReadOnly]);

      console.log('✅ Default users created');
    }

    console.log('✅ Database initialized successfully');
  } catch (error) {
    console.error('❌ Database initialization error:', error);
    throw error;
  }
}

module.exports = initDatabase;

