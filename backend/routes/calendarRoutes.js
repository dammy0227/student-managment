// routes/calendarRoutes.js
const express = require('express');
const router = express.Router();
const calendarController = require('../controllers/calendarController');
const { protect } = require('../middleware/authMiddleware');


// New routes using studentId
router.get('/student/:studentId', protect, calendarController.getEventsByStudent);
router.post('/student', protect, calendarController.createEventByStudent);
// routes/calendarRoutes.js
router.put('/student/:studentId/mark-read', protect, calendarController.markCalendarAsRead);
// routes/calendarRoutes.js
router.get('/student/:studentId/unread-count', protect, calendarController.getUnreadEventCount);



module.exports = router;
