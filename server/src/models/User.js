const pool = require('../config/database');

class User {
  static async findAll() {
    const [rows] = await pool.query(
      `SELECT u.id, u.username, u.email, u.created_at, u.updated_at, r.name as role_name, r.id as role_id
       FROM users u
       JOIN roles r ON u.role_id = r.id
       ORDER BY u.created_at DESC`
    );
    return rows;
  }

  static async findById(id) {
    const [rows] = await pool.query(
      `SELECT u.id, u.username, u.email, u.created_at, u.updated_at, r.name as role_name, r.id as role_id
       FROM users u
       JOIN roles r ON u.role_id = r.id
       WHERE u.id = ?`,
      [id]
    );
    return rows[0];
  }

  static async findByUsername(username) {
    const [rows] = await pool.query(
      `SELECT u.*, r.name as role_name
       FROM users u
       JOIN roles r ON u.role_id = r.id
       WHERE u.username = ?`,
      [username]
    );
    return rows[0];
  }

  static async findByEmail(email) {
    const [rows] = await pool.query(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );
    return rows[0];
  }

  static async create(userData) {
    const { username, email, password, role_id } = userData;
    const [result] = await pool.query(
      'INSERT INTO users (username, email, password, role_id) VALUES (?, ?, ?, ?)',
      [username, email, password, role_id]
    );
    return this.findById(result.insertId);
  }

  static async update(id, userData) {
    const { username, email, role_id, password } = userData;
    const updates = [];
    const values = [];

    if (username) {
      updates.push('username = ?');
      values.push(username);
    }
    if (email) {
      updates.push('email = ?');
      values.push(email);
    }
    if (role_id) {
      updates.push('role_id = ?');
      values.push(role_id);
    }
    if (password) {
      updates.push('password = ?');
      values.push(password);
    }

    if (updates.length === 0) {
      return this.findById(id);
    }

    values.push(id);
    await pool.query(
      `UPDATE users SET ${updates.join(', ')} WHERE id = ?`,
      values
    );
    return this.findById(id);
  }

  static async delete(id) {
    await pool.query('DELETE FROM users WHERE id = ?', [id]);
    return true;
  }
}

module.exports = User;

