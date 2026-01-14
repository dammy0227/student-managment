import express from 'express';
import {
  getNotifications,
  markAllAsRead,
  getNotificationsForStudent
} from '../controllers/notificationController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', protect, getNotifications);

router.get('/student/:studentId', protect, getNotificationsForStudent);

router.patch('/read-all', protect, markAllAsRead);

export default router;
