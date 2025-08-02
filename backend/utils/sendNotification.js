const Notification = require('../models/Notification');

const sendNotification = async ({ userId, message, type = 'info' }) => {
  try {
    const notif = new Notification({
      user: userId,
      message,
      type,
    });
    await notif.save();
    return notif;
  } catch (err) {
    console.error('Notification error:', err.message);
  }
};

module.exports = { sendNotification };
