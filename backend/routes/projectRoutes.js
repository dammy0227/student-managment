const express = require('express');
const router = express.Router();

const {
  createProject,
  getAllProjects,
  getProjectById,
  updateProjectStatus,
  assignSupervisor,
  getSupervisedProjects,
  getMyProjects,
  markProjectsAsRead,
  getUnreadProjectCount,
  getProjectsByStudent
} = require('../controllers/projectController');

const { protect } = require('../middleware/authMiddleware');
const { allowRoles } = require('../middleware/roleMiddleware');

// Student submits a project
router.post('/', protect, allowRoles('student'), createProject);

// Admin & Supervisor view all projects
router.get('/', protect, allowRoles('admin', 'supervisor'), getAllProjects);

// Student views own projects
router.get('/my', protect, allowRoles('student'), getMyProjects);

// Get single project by ID
router.get('/:id', protect, getProjectById);

// Admin updates project status
router.patch('/:id/status', protect, allowRoles('admin', 'supervisor'), updateProjectStatus);

// Admin assigns supervisor
router.patch('/:id/assign-supervisor', protect, allowRoles('admin'), assignSupervisor);

router.get('/supervised', protect, allowRoles('supervisor'), getSupervisedProjects);

router.patch('/supervised/mark-read', protect, allowRoles('supervisor'), markProjectsAsRead);
router.get('/supervised/unread-count', protect, allowRoles('supervisor'), getUnreadProjectCount);

// Supervisor or Admin gets projects by a specific student
router.get('/student/:studentId', protect, allowRoles('supervisor', 'admin'), getProjectsByStudent);


module.exports = router;
