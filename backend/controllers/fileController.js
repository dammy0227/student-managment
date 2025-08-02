const Document = require('../models/Document');
const Project = require('../models/Project');
const User = require('../models/User');
const Notification = require('../models/Notification');

// 📥 Upload a Document (Student only)
exports.uploadDocument = async (req, res) => {
  try {
    const { projectId } = req.body;
    const file = req.file;

    if (!file) return res.status(400).json({ message: 'No file uploaded' });

    const student = await User.findById(req.user.id);
    if (!student || student.role !== 'Student') {
      return res.status(403).json({ message: 'Only students can upload files' });
    }

    if (!student.supervisorId) {
      return res.status(403).json({ message: 'Student has no assigned supervisor' });
    }

    const newDoc = new Document({
      project: projectId,
      uploadedBy: req.user.id,
      fileUrl: `/uploads/${file.filename}`,
      fileName: file.originalname,
      version: 1,
      status: 'Pending',
    });

    await newDoc.save();

    try {
      await Notification.create({
        user: student.supervisorId,
        message: `New file uploaded by ${student.fullName}`,
        link: `/supervisor/student/${student._id}/project-file`,
      });
    } catch (notifErr) {
      console.error('Notification Error:', notifErr.message);
    }

    if (global._io) {
      global._io.emit('fileUploaded', {
        supervisorId: student.supervisorId.toString(),
        studentName: student.fullName,
        studentId: student._id.toString(),
      });
    }

    res.status(201).json({ message: 'File uploaded', document: newDoc });

  } catch (err) {
    console.error('Upload Error:', err); // ✅ Add this for real-time debugging
    res.status(500).json({ message: 'Upload failed', error: err.message });
  }
};



// 📄 Get All Files Under a Project (Student or Supervisor)
exports.getDocuments = async (req, res) => {
  try {
    const { projectId } = req.params;
     console.log('📥 Incoming projectId:', projectId); // <== add this

    const project = await Project.findById(projectId).populate('student');

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const student = project.student;
    const loggedInUser = req.user;

    const isStudent = loggedInUser.id === student._id.toString();
    const isSupervisor =
      student.supervisorId && student.supervisorId.toString() === loggedInUser.id;
    const isAdmin = loggedInUser.role === 'admin';

    if (!isStudent && !isSupervisor && !isAdmin) {
      return res.status(403).json({ message: 'Not authorized to view these files' });
    }

    const documents = await Document.find({ project: projectId })
      .populate('uploadedBy', 'fullName role')
      .sort({ uploadedAt: -1 });

    res.json(documents);
  } catch (err) {
    console.error('Error getting documents:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// 👁️ Supervisor - Get All Files of Assigned Students
exports.getSupervisorFiles = async (req, res) => {
  try {
    const supervisorId = req.user.id;

    if (req.user.role !== 'Supervisor') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const assignedStudents = await User.find({ supervisorId }).select('_id');
    const studentIds = assignedStudents.map((student) => student._id);

    const projects = await Project.find({ student: { $in: studentIds } }).select('_id');
    const projectIds = projects.map((p) => p._id);

    const documents = await Document.find({ project: { $in: projectIds } })
      .populate('uploadedBy', 'fullName role matricNumber')
      .populate('project', 'title')
      .sort({ uploadedAt: -1 });

    res.json(documents);
  } catch (err) {
    console.error('Failed to get supervisor files:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// ✅ Supervisor - Approve or Reject a File
exports.updateDocumentStatus = async (req, res) => {
  try {
    const { documentId } = req.params;
    const { status } = req.body;

    console.log('🔄 Incoming status update:', status);
    console.log('📄 Document ID:', documentId);
    console.log('👤 User:', req.user);

    if (!['Approved', 'Rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    if (req.user.role !== 'Supervisor') {
      return res.status(403).json({ message: 'Only supervisors can update status' });
    }

    const document = await Document.findById(documentId).populate('project');

    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }

    const student = await User.findById(document.project.student);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    if (student.supervisorId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized access to this file' });
    }

    document.status = status;
    await document.save();

    await Notification.create({
      user: student._id,
      message: `Your file was ${status.toLowerCase()} by your supervisor`,
      link: `/student/view-project`,
    });

    if (global._io) {
      global._io.emit('statusUpdated', {
        studentId: student._id.toString(),
        message: `Your file was ${status.toLowerCase()} by your supervisor`,
      });
    }

    res.json({ message: `Marked as ${status}`, document });

  } catch (err) {
    console.error('❌ Error updating document status:', err.message);
    res.status(500).json({ message: 'Error updating document status', error: err.message });
  }
};



// 📄 Mark all uploaded files as read
exports.markFilesAsRead = async (req, res) => {
  try {
    if (req.user.role !== 'Supervisor') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const studentIds = await User.find({ supervisorId: req.user.id }).select('_id');
    const projectIds = await Project.find({ student: { $in: studentIds } }).select('_id');

    await Document.updateMany(
      { project: { $in: projectIds }, isReadBySupervisor: false },
      { isReadBySupervisor: true }
    );

    res.json({ message: 'Files marked as read' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to mark files as read' });
  }
};


exports.getUnreadFileCount = async (req, res) => {
  if (req.user.role !== 'Supervisor') {
    return res.status(403).json({ message: 'Access denied' });
  }

  const studentIds = await User.find({ supervisorId: req.user.id }).select('_id');
  const projectIds = await Project.find({ student: { $in: studentIds } }).select('_id');

  const count = await Document.countDocuments({
    project: { $in: projectIds },
    isReadBySupervisor: false,
  });

  res.json({ count });
};