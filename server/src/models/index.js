const sequelize = require('../config/sequelize');
const Role = require('./Role');
const Permission = require('./Permission');
const RolePermission = require('./RolePermission');
const User = require('./User');
const UserLog = require('./UserLog');
const Notification = require('./Notification');
const File = require('./File');
const PasswordReset = require('./PasswordReset');

// Define associations
User.belongsTo(Role, { foreignKey: 'role_id', as: 'role' });
Role.hasMany(User, { foreignKey: 'role_id', as: 'users' });

Role.belongsToMany(Permission, {
  through: RolePermission,
  foreignKey: 'role_id',
  otherKey: 'permission_id',
  as: 'permissions'
});

Permission.belongsToMany(Role, {
  through: RolePermission,
  foreignKey: 'permission_id',
  otherKey: 'role_id',
  as: 'roles'
});

// UserLog associations
UserLog.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
UserLog.belongsTo(User, { foreignKey: 'performed_by', as: 'performer' });
User.hasMany(UserLog, { foreignKey: 'user_id', as: 'logs' });

// Notification associations
Notification.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
Notification.belongsTo(Role, { foreignKey: 'role_id', as: 'role' });
User.hasMany(Notification, { foreignKey: 'user_id', as: 'notifications' });

// File associations
File.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
User.hasMany(File, { foreignKey: 'user_id', as: 'files' });

// PasswordReset associations
PasswordReset.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
User.hasMany(PasswordReset, { foreignKey: 'user_id', as: 'passwordResets' });

module.exports = {
  sequelize,
  User,
  Role,
  Permission,
  RolePermission,
  UserLog,
  Notification,
  File,
  PasswordReset
};

