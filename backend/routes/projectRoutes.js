import express from 'express';
import {
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
} from '../controllers/projectController.js';
import { protect } from '../middleware/authMiddleware.js';
import { allowRoles } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.post('/', protect, allowRoles('student'), createProject);

router.get('/', protect, allowRoles('admin', 'supervisor'), getAllProjects);

router.get('/my', protect, allowRoles('student'), getMyProjects);

router.get('/:id', protect, getProjectById);

router.patch('/:id/status', protect, allowRoles('admin', 'supervisor'), updateProjectStatus);

router.patch('/:id/assign-supervisor', protect, allowRoles('admin'), assignSupervisor);

router.get('/supervised', protect, allowRoles('supervisor'), getSupervisedProjects);

router.patch('/supervised/mark-read', protect, allowRoles('supervisor'), markProjectsAsRead);
router.get('/supervised/unread-count', protect, allowRoles('supervisor'), getUnreadProjectCount);

router.get('/student/:studentId', protect, allowRoles('supervisor', 'admin'), getProjectsByStudent);

export default router;
