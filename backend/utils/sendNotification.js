const Notification = require('../models/Notification');

const sendNotification = async ({ userId, message, type = 'info' }) => {
  try {
    const notification = new Notification({
      user: userId,
      message,
      type,
    });
    await notification.save();
    return notification;
  } catch (err) {
    console.error('❌ Failed to send notification:', err.message);
    return null;
  }
};

module.exports = { sendNotification };
