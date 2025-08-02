const express = require('express');
const router = express.Router();

const {
  sendFeedback,
  getFeedbackForStudent,
  updateFeedback,
  deleteFeedback,
  markFeedbackAsRead,getUnreadFeedbackCount
} = require('../controllers/feedbackController');


const { protect } = require('../middleware/authMiddleware');
const { allowRoles } = require('../middleware/roleMiddleware');

// ✅ Supervisor sends feedback to assigned student
router.post('/send', protect, allowRoles('supervisor'), sendFeedback);

// ✅ Supervisor updates feedback
router.put('/:feedbackId', protect, allowRoles('supervisor'), updateFeedback);

// ✅ Supervisor deletes feedback
router.delete('/:feedbackId', protect, allowRoles('supervisor'), deleteFeedback);

// ✅ Student views their feedback
router.get('/student/:studentId', protect, allowRoles('student', 'supervisor', 'admin'), getFeedbackForStudent);

// routes/feedbackRoutes.js

router.put('/mark-read', protect, allowRoles('student'), markFeedbackAsRead);

router.get('/unread-count', protect, allowRoles('student'), getUnreadFeedbackCount);



module.exports = router;
