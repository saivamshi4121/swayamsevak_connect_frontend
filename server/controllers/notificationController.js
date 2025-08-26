const Notification = require('../models/Notification');
const User = require('../models/User');

// Send notification
exports.sendNotification = async (req, res) => {
  try {
    const { title, message, recipients } = req.body;
    if (!title || !message || !recipients || !recipients.length) {
      return res.status(400).json({ msg: 'All fields required' });
    }
    const notification = await Notification.create({ title, message, recipients });
    // Real-time emit
    const io = req.app.get('io');
    const userSockets = req.app.get('userSockets');
    if (recipients.includes('all')) {
      io.emit('notification', notification);
    } else {
      recipients.forEach(userId => {
        const socketId = userSockets.get(userId);
        if (socketId) io.to(socketId).emit('notification', notification);
      });
    }
    res.status(201).json(notification);
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};

// Get all notifications
exports.getAllNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find().sort({ createdAt: -1 });
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};

// Delete notification
exports.deleteNotification = async (req, res) => {
  try {
    const notification = await Notification.findByIdAndDelete(req.params.id);
    if (!notification) return res.status(404).json({ msg: 'Notification not found' });
    res.json({ msg: 'Notification deleted' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};

// Get notifications for the current user
exports.getUserNotifications = async (req, res) => {
  try {
    const userId = req.user.id;
    const notifications = await Notification.find({
      $or: [
        { recipients: 'all' },
        { recipients: userId },
      ],
    }).sort({ createdAt: -1 });
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
}; 