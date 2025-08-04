const express = require('express');
const router = express.Router();
const upload = require('../utils/fileUploader');
const { protect } = require('../middleware/authMiddleware');
const {allowRoles}= require('../middleware/roleMiddleware')

const {
  uploadDocument,        // ✅ this matches the controller
  getDocuments,     
  getSupervisorFiles,
  updateDocumentStatus,
  markFilesAsRead,
  getUnreadFileCount
} = require('../controllers/fileController');

// Get all files from students assigned to the supervisor
router.get('/assigned-to-me', protect, getSupervisorFiles);


router.post(
  '/upload',
  protect,
  allowRoles('student'),
  upload.single('file'), // ✅ this is key
  uploadDocument
);

// Get all files under a project
router.get('/:projectId', protect, getDocuments);

router.put('/status/:documentId', protect, updateDocumentStatus);


router.patch('/assigned-to-me/mark-read', protect, markFilesAsRead);
router.get('/assigned-to-me/unread-count', protect, getUnreadFileCount);



module.exports = router;