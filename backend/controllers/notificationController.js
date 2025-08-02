const Notification = require('../models/Notification');

// Get all notifications for logged-in user
exports.getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch notifications', error: err.message });
  }
};

// Mark all as read
exports.markAllAsRead = async (req, res) => {
  try {
    await Notification.updateMany(
      { user: req.user.id, isRead: false },
      { $set: { isRead: true } }
    );
    res.json({ message: 'All notifications marked as read' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update all notifications', error: err.message });
  }
};

// ✅ Get notifications for a specific student (supervisor-only)
exports.getNotificationsForStudent = async (req, res) => {
  try {
    const { studentId } = req.params;

    const student = await require('../models/User').findById(studentId);
    if (!student || student.supervisorId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Access denied: You are not the assigned supervisor.' });
    }

    const notifications = await Notification.find({ user: studentId }).sort({ createdAt: -1 });
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch student notifications', error: err.message });
  }
};
