import express from 'express';
import {
  sendMessage,
  getMessages,
  markMessagesAsRead,
  getUnreadMessages
} from '../controllers/messageController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, sendMessage);

router.get('/:userId', protect, getMessages);

router.patch('/read', protect, markMessagesAsRead);

router.get('/unread/all', protect, getUnreadMessages);

export default router;
