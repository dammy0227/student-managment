import Notification from '../models/Notification.js';
import User from '../models/User.js';

export const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch notifications', error: err.message });
  }
};

export const markAllAsRead = async (req, res) => {
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

export const getNotificationsForStudent = async (req, res) => {
  try {
    const { studentId } = req.params;
    const student = await User.findById(studentId);

    if (!student || student.supervisorId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Access denied: You are not the assigned supervisor.' });
    }

    const notifications = await Notification.find({ user: studentId }).sort({ createdAt: -1 });
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch student notifications', error: err.message });
  }
};
