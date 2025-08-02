const express = require('express');
const router = express.Router();
const {
  getAllStudents,
  getAllSupervisors,
  getUserById,
  updateUserRole,
  createSupervisor,
  assignStudentToSupervisor,
  getMyStudents
} = require('../controllers/userController');

const { protect } = require('../middleware/authMiddleware');
const { allowRoles } = require('../middleware/roleMiddleware');

router.post('/create-supervisor', protect, allowRoles('admin'), createSupervisor);
router.get('/students', protect, allowRoles('admin'), getAllStudents);
router.get('/supervisors', protect, allowRoles('admin'), getAllSupervisors);
router.patch('/:id/role', protect, allowRoles('admin'), updateUserRole);
router.get('/my-students', protect, allowRoles('supervisor'), getMyStudents);
router.get('/:id', protect, getUserById);
router.patch('/:id/assign-supervisor', protect, allowRoles('admin'), assignStudentToSupervisor);
router.get('/my-students', protect, allowRoles('supervisor'), getMyStudents);

module.exports = router;
