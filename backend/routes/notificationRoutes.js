const express = require('express');
const router = express.Router();

const {
  getNotifications,
  markAllAsRead,
  getNotificationsForStudent
} = require('../controllers/notificationController');

const { protect } = require('../middleware/authMiddleware');

// Get all notifications for logged-in user
router.get('/', protect, getNotifications);

router.get('/student/:studentId', protect, getNotificationsForStudent);

router.patch('/read-all', protect, markAllAsRead);


module.exports = router;
 