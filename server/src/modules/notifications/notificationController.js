const { Notification, User, Role } = require('../../models');

const getNotifications = async (req, res) => {
  try {
    const userId = req.user.id;
    const isRead = req.query.read === 'true' ? true : req.query.read === 'false' ? false : null;

    const where = { user_id: userId };
    if (isRead !== null) {
      where.is_read = isRead;
    }

    const notifications = await Notification.findAll({
      where,
      order: [['created_at', 'DESC']],
      limit: 50
    });

    res.json(notifications);
  } catch (error) {
    console.error('Get notifications error:', error);
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
};

const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const notification = await Notification.findOne({
      where: { id, user_id: userId }
    });

    if (!notification) {
      return res.status(404).json({ error: 'Notification not found' });
    }

    await notification.update({ is_read: true });
    res.json({ message: 'Notification marked as read' });
  } catch (error) {
    console.error('Mark notification as read error:', error);
    res.status(500).json({ error: 'Failed to update notification' });
  }
};

const markAllAsRead = async (req, res) => {
  try {
    const userId = req.user.id;

    await Notification.update(
      { is_read: true },
      { where: { user_id: userId, is_read: false } }
    );

    res.json({ message: 'All notifications marked as read' });
  } catch (error) {
    console.error('Mark all as read error:', error);
    res.status(500).json({ error: 'Failed to update notifications' });
  }
};

const getUnreadCount = async (req, res) => {
  try {
    const userId = req.user.id;

    const count = await Notification.count({
      where: { user_id: userId, is_read: false }
    });

    res.json({ count });
  } catch (error) {
    console.error('Get unread count error:', error);
    res.status(500).json({ error: 'Failed to get unread count' });
  }
};

module.exports = {
  getNotifications,
  markAsRead,
  markAllAsRead,
  getUnreadCount
};

