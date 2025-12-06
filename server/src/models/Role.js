const pool = require('../config/database');

class Role {
  static async findAll() {
    const [rows] = await pool.query(
      `SELECT r.*, 
       GROUP_CONCAT(p.name) as permissions
       FROM roles r
       LEFT JOIN role_permissions rp ON r.id = rp.role_id
       LEFT JOIN permissions p ON rp.permission_id = p.id
       GROUP BY r.id
       ORDER BY r.id`
    );
    return rows;
  }

  static async findById(id) {
    const [rows] = await pool.query(
      `SELECT r.*, 
       GROUP_CONCAT(p.name) as permissions
       FROM roles r
       LEFT JOIN role_permissions rp ON r.id = rp.role_id
       LEFT JOIN permissions p ON rp.permission_id = p.id
       WHERE r.id = ?
       GROUP BY r.id`,
      [id]
    );
    return rows[0];
  }

  static async findByName(name) {
    const [rows] = await pool.query('SELECT * FROM roles WHERE name = ?', [name]);
    return rows[0];
  }

  static async create(roleData) {
    const { name, description } = roleData;
    const [result] = await pool.query(
      'INSERT INTO roles (name, description) VALUES (?, ?)',
      [name, description]
    );
    return this.findById(result.insertId);
  }

  static async update(id, roleData) {
    const { name, description } = roleData;
    const updates = [];
    const values = [];

    if (name) {
      updates.push('name = ?');
      values.push(name);
    }
    if (description !== undefined) {
      updates.push('description = ?');
      values.push(description);
    }

    if (updates.length === 0) {
      return this.findById(id);
    }

    values.push(id);
    await pool.query(
      `UPDATE roles SET ${updates.join(', ')} WHERE id = ?`,
      values
    );
    return this.findById(id);
  }

  static async delete(id) {
    await pool.query('DELETE FROM roles WHERE id = ?', [id]);
    return true;
  }

  static async getPermissions(roleId) {
    const [rows] = await pool.query(
      `SELECT p.* FROM permissions p
       JOIN role_permissions rp ON p.id = rp.permission_id
       WHERE rp.role_id = ?`,
      [roleId]
    );
    return rows;
  }

  static async addPermission(roleId, permissionId) {
    await pool.query(
      'INSERT IGNORE INTO role_permissions (role_id, permission_id) VALUES (?, ?)',
      [roleId, permissionId]
    );
    return true;
  }

  static async removePermission(roleId, permissionId) {
    await pool.query(
      'DELETE FROM role_permissions WHERE role_id = ? AND permission_id = ?',
      [roleId, permissionId]
    );
    return true;
  }
}

module.exports = Role;

