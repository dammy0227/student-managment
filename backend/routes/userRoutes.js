import express from 'express';
import {
  getAllStudents,
  getAllSupervisors,
  getUserById,
  updateUserRole,
  createSupervisor,
  assignStudentToSupervisor,
  getMyStudents
} from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';
import { allowRoles } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.post('/create-supervisor', protect, allowRoles('admin'), createSupervisor);
router.get('/students', protect, allowRoles('admin'), getAllStudents);
router.get('/supervisors', protect, allowRoles('admin'), getAllSupervisors);
router.patch('/:id/role', protect, allowRoles('admin'), updateUserRole);
router.get('/my-students', protect, allowRoles('supervisor'), getMyStudents);
router.get('/:id', protect, getUserById);
router.patch('/:id/assign-supervisor', protect, allowRoles('admin'), assignStudentToSupervisor);

export default router;
