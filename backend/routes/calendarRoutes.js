import express from 'express';
import * as calendarController from '../controllers/calendarController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/student/:studentId', protect, calendarController.getEventsByStudent);
router.post('/student', protect, calendarController.createEventByStudent);
router.put('/student/:studentId/mark-read', protect, calendarController.markCalendarAsRead);
router.get('/student/:studentId/unread-count', protect, calendarController.getUnreadEventCount);

export default router;
