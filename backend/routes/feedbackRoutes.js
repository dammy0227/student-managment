import express from 'express';
import {
  sendFeedback,
  getFeedbackForStudent,
  updateFeedback,
  deleteFeedback,
  markFeedbackAsRead,
  getUnreadFeedbackCount
} from '../controllers/feedbackController.js';
import { protect } from '../middleware/authMiddleware.js';
import { allowRoles } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.post('/send', protect, allowRoles('supervisor'), sendFeedback);
router.put('/:feedbackId', protect, allowRoles('supervisor'), updateFeedback);
router.delete('/:feedbackId', protect, allowRoles('supervisor'), deleteFeedback);
router.get('/student/:studentId', protect, allowRoles('student', 'supervisor', 'admin'), getFeedbackForStudent);

router.put('/mark-read', protect, allowRoles('student'), markFeedbackAsRead);
router.get('/unread-count', protect, allowRoles('student'), getUnreadFeedbackCount);

export default router;
