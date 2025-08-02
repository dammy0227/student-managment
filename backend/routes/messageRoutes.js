const express = require('express');
const router = express.Router();

const {
  sendMessage,
  getMessages,
  markMessagesAsRead,
  getUnreadMessages
} = require('../controllers/messageController');

const { protect } = require('../middleware/authMiddleware');

// Send a message
router.post('/', protect, sendMessage);

// Get chat with another user
router.get('/:userId', protect, getMessages);

router.patch('/read', protect, markMessagesAsRead);


router.get('/unread/all', protect, getUnreadMessages); // ✅ add this


module.exports = router;
