const { User, Role } = require('./index');

class UserModel {
  static async findAll(includeDeleted = false) {
    const where = {};
    if (!includeDeleted) {
      where.deleted_at = null;
    }
    
    return await User.findAll({
      where,
      include: [{
        model: Role,
        as: 'role',
        attributes: ['id', 'name', 'description']
      }],
      attributes: ['id', 'username', 'email', 'created_at', 'updated_at', 'role_id', 'deleted_at'],
      order: [['created_at', 'DESC']]
    });
  }

  static async findById(id) {
    const user = await User.findByPk(id, {
      include: [{
        model: Role,
        as: 'role',
        attributes: ['id', 'name', 'description']
      }],
      attributes: ['id', 'username', 'email', 'created_at', 'updated_at', 'role_id']
    });
    return user;
  }

  static async findByUsername(username) {
    const user = await User.findOne({
      where: { username },
      include: [{
        model: Role,
        as: 'role',
        attributes: ['id', 'name', 'description']
      }]
    });
    return user;
  }

  static async findByEmail(email) {
    return await User.findOne({ where: { email } });
  }

  static async create(userData) {
    const user = await User.create(userData);
    return await this.findById(user.id);
  }

  static async update(id, userData) {
    await User.update(userData, { where: { id } });
    return await this.findById(id);
  }

  static async delete(id, hardDelete = false) {
    if (hardDelete) {
      await User.destroy({ where: { id }, force: true });
    } else {
      // Soft delete
      await User.update({ deleted_at: new Date() }, { where: { id } });
    }
    return true;
  }

  static async restore(id) {
    await User.update({ deleted_at: null }, { where: { id } });
    return await this.findById(id);
  }
}

module.exports = UserModel;

