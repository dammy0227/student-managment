import express from 'express';
import upload from '../utils/fileUploader.js';
import { protect } from '../middleware/authMiddleware.js';
import { allowRoles } from '../middleware/roleMiddleware.js';
import {
  uploadDocument,
  getDocuments,
  getSupervisorFiles,
  updateDocumentStatus,
  markFilesAsRead,
  getUnreadFileCount
} from '../controllers/fileController.js';

const router = express.Router();

router.get('/assigned-to-me', protect, getSupervisorFiles);

router.post(
  '/upload',
  protect,
  allowRoles('student'),
  upload.single('file'),
  uploadDocument
);

router.get('/:projectId', protect, getDocuments);

router.put('/status/:documentId', protect, updateDocumentStatus);

router.patch('/assigned-to-me/mark-read', protect, markFilesAsRead);
router.get('/assigned-to-me/unread-count', protect, getUnreadFileCount);

export default router;
