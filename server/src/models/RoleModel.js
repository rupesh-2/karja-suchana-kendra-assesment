const { Role, Permission } = require('./index');

class RoleModel {
  static async findAll() {
    const roles = await Role.findAll({
      include: [{
        model: Permission,
        as: 'permissions',
        attributes: ['id', 'name', 'description'],
        through: { attributes: [] }
      }],
      order: [['id', 'ASC']]
    });

    // Format permissions as comma-separated string for compatibility
    return roles.map(role => {
      const roleData = role.toJSON();
      if (roleData.permissions && roleData.permissions.length > 0) {
        roleData.permissions = roleData.permissions.map(p => p.name).join(',');
      }
      return roleData;
    });
  }

  static async findById(id) {
    const role = await Role.findByPk(id, {
      include: [{
        model: Permission,
        as: 'permissions',
        attributes: ['id', 'name', 'description'],
        through: { attributes: [] }
      }]
    });

    if (role) {
      const roleData = role.toJSON();
      if (roleData.permissions && roleData.permissions.length > 0) {
        roleData.permissions = roleData.permissions.map(p => p.name).join(',');
      }
      return roleData;
    }
    return null;
  }

  static async findByName(name) {
    return await Role.findOne({ where: { name } });
  }

  static async create(roleData) {
    const role = await Role.create(roleData);
    return await this.findById(role.id);
  }

  static async update(id, roleData) {
    await Role.update(roleData, { where: { id } });
    return await this.findById(id);
  }

  static async delete(id) {
    await Role.destroy({ where: { id } });
    return true;
  }

  static async getPermissions(roleId) {
    const role = await Role.findByPk(roleId, {
      include: [{
        model: Permission,
        as: 'permissions',
        through: { attributes: [] }
      }]
    });
    return role ? role.permissions : [];
  }

  static async addPermission(roleId, permissionId) {
    const role = await Role.findByPk(roleId);
    const permission = await Permission.findByPk(permissionId);
    if (role && permission) {
      await role.addPermission(permission);
    }
    return true;
  }

  static async removePermission(roleId, permissionId) {
    const role = await Role.findByPk(roleId);
    const permission = await Permission.findByPk(permissionId);
    if (role && permission) {
      await role.removePermission(permission);
    }
    return true;
  }
}

module.exports = RoleModel;

