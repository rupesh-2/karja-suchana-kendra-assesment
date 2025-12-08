const { UserLog, User } = require('../models');

class LogService {
  static async createLog(userId, action, performedBy, req = null) {
    try {
      const logData = {
        user_id: userId,
        action,
        performed_by: performedBy,
        ip_address: req?.ip || req?.connection?.remoteAddress || null,
        user_agent: req?.headers?.['user-agent'] || null
      };

      return await UserLog.create(logData);
    } catch (error) {
      console.error('Error creating log:', error);
      // Don't throw - logging shouldn't break the app
      return null;
    }
  }

  static async getLogs(limit = 100, offset = 0) {
    return await UserLog.findAll({
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'username', 'email']
        },
        {
          model: User,
          as: 'performer',
          attributes: ['id', 'username', 'email']
        }
      ],
      order: [['timestamp', 'DESC']],
      limit,
      offset
    });
  }

  static async getUserLogs(userId, limit = 50) {
    return await UserLog.findAll({
      where: { user_id: userId },
      include: [
        {
          model: User,
          as: 'performer',
          attributes: ['id', 'username', 'email']
        }
      ],
      order: [['timestamp', 'DESC']],
      limit
    });
  }
}

module.exports = LogService;

