const { User, Role } = require('./index');

class UserModel {
  static async findAll() {
    return await User.findAll({
      include: [{
        model: Role,
        as: 'role',
        attributes: ['id', 'name', 'description']
      }],
      attributes: ['id', 'username', 'email', 'created_at', 'updated_at', 'role_id'],
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

  static async delete(id) {
    await User.destroy({ where: { id } });
    return true;
  }
}

module.exports = UserModel;

