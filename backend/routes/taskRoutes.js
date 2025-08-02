const express = require('express');
const router = express.Router();

const {
  createTask,
  getProjectTasks,
  updateTaskStatus,
} = require('../controllers/taskController');

const { protect } = require('../middleware/authMiddleware');
const { allowRoles } = require('../middleware/roleMiddleware');

// Student/Supervisor can add tasks to project
router.post('/', protect, allowRoles('student', 'supervisor'), createTask);

// View all tasks under a project
router.get('/:projectId', protect, getProjectTasks);

// Update task status (e.g., completed)
router.patch('/:id/status', protect, allowRoles('student', 'supervisor'), updateTaskStatus);



module.exports = router;
