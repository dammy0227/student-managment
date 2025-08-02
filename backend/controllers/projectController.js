const Project = require('../models/Project');
const User = require('../models/User');
const { checkDuplicateTitle } = require('../utils/duplicateCheck');
const Notification = require('../models/Notification');

// 📌 Student submits a project
exports.createProject = async (req, res) => {
  try {
    const { title, description } = req.body;

    const isDuplicate = await checkDuplicateTitle(title);
    if (isDuplicate) {
      return res.status(400).json({
        message: 'This project topic has already been selected by another student. Please choose a different topic.',
      });
    }

    const existingProjects = await Project.find({ student: req.user.id });
    if (existingProjects.length >= 3) {
      return res.status(400).json({ message: '❌ You can only submit a maximum of 3 projects' });
    }

    const student = await User.findById(req.user.id);
    if (!student || student.role !== 'Student') {
      return res.status(403).json({ message: 'Only students can submit projects' });
    }

    if (!student.supervisorId) {
      return res.status(403).json({
        message: 'You must be assigned to a supervisor before submitting a project',
      });
    }

    const project = new Project({
      title,
      description,
      student: student._id,
      supervisor: student.supervisorId,
    });

    await project.save();

    // 🛑 Wrap optional features in separate try-catch
    try {
      // Notification
      await Notification.create({
        user: student.supervisorId,
        message: `New project submitted by ${student.fullName}`,
        link: `/supervisor/student/${student._id}/view-project`,
      });

      // WebSocket
      global._io.emit('projectSubmitted', {
        supervisorId: student.supervisorId.toString(),
        studentId: student._id.toString(),
        studentName: student.fullName,
        title,
      });
    } catch (extraErr) {
      console.warn('⚠️ Project saved but socket or notification failed:', extraErr.message);
    }

    return res.status(201).json({ message: 'Project submitted successfully', project });

  } catch (err) {
    console.error('❌ Project submission failed:', err.message);
    res.status(500).json({ message: 'Failed to submit project', error: err.message });
  }
};


// 📌 Admin or Supervisor gets all projects
exports.getAllProjects = async (req, res) => {
  try {
    const filter = req.user.role === 'supervisor' ? { supervisor: req.user.id } : {};

    const projects = await Project.find(filter)
      .populate('student', 'fullName email matricNumber')
      .populate('supervisor', 'fullName email matricNumber');

    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch projects', error: err.message });
  }
};

// 📌 Get a single project by ID
exports.getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('student', 'fullName email matricNumber')
      .populate('supervisor', 'fullName email matricNumber');

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    res.json(project);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch project by ID', error: err.message });
  }
};

// 📌 Admin or Supervisor updates project status
exports.updateProjectStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const projectId = req.params.id;

    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (
      req.user.role !== 'admin' &&
      project.supervisor.toString() !== req.user.id
    ) {
      return res.status(403).json({ message: 'Not authorized to update this project' });
    }

    project.status = status;
    await project.save();

    // 🔐 Optional safety check to emit via WebSocket
    if (global._io && typeof global._io.emit === 'function') {
      global._io.emit('projectStatusUpdated', {
        studentId: project.student?.toString?.() || '',
        projectId: project._id.toString(),
        status,
      });
    }

    res.json({ message: `Project ${status}`, project });
  } catch (err) {
    console.error('❌ updateProjectStatus error:', err.message);
    res.status(500).json({
      message: 'Failed to update project status',
      error: err.message,
    });
  }
};

// 📌 Admin assigns supervisor to project
exports.assignSupervisor = async (req, res) => {
  try {
    const { supervisorId } = req.body;

    const project = await Project.findByIdAndUpdate(
      req.params.id,
      {
        supervisor: supervisorId,
        status: 'In Progress',
      },
      { new: true }
    );

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    res.json({ message: 'Supervisor assigned successfully', project });
  } catch (err) {
    res.status(500).json({ message: 'Failed to assign supervisor', error: err.message });
  }
};

// 📌 Supervisor views their supervised projects
exports.getSupervisedProjects = async (req, res) => {
  try {
    const projects = await Project.find({ supervisor: req.user.id }).populate('student', 'fullName email matricNumber');
    res.json(projects);
  } catch (err) {
    res.status(500).json({
      message: 'Failed to fetch supervised projects',
      error: err.message,
    });
  }
};

// 📌 Student gets their submitted projects
exports.getMyProjects = async (req, res) => {
  try {
    const projects = await Project.find({ student: req.user.id }).populate('supervisor', 'fullName email matricNumber');
    res.json(projects);
  } catch (err) {
    res.status(500).json({
      message: 'Failed to fetch your projects',
      error: err.message,
    });
  }
};

// 📌 Mark all supervised projects as read
exports.markProjectsAsRead = async (req, res) => {
  try {
    if (req.user.role !== 'Supervisor') {
      return res.status(403).json({ message: 'Access denied' });
    }

    await Project.updateMany(
      { supervisor: req.user.id, isReadBySupervisor: false },
      { isReadBySupervisor: true }
    );

    res.json({ message: 'Projects marked as read' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to mark projects as read' });
  }
};

// 📌 Count of unread project submissions for supervisor
exports.getUnreadProjectCount = async (req, res) => {
  if (req.user.role !== 'Supervisor') {
    return res.status(403).json({ message: 'Access denied' });
  }

  try {
    const count = await Project.countDocuments({
      supervisor: req.user.id,
      isReadBySupervisor: false
    });

    res.json({ count });
  } catch (err) {
    res.status(500).json({ message: 'Failed to get unread count', error: err.message });
  }
};


// 📌 Supervisor or Admin gets all projects by a specific student
exports.getProjectsByStudent = async (req, res) => {
  const { studentId } = req.params;

  try {
    const student = await User.findById(studentId);
    if (!student || student.role !== 'Student') {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Only allow supervisor to view if they are assigned to this student
    if (req.user.role === 'supervisor' && student.supervisorId?.toString() !== req.user.id) {
      return res.status(403).json({ message: 'You are not assigned to this student' });
    }

    const projects = await Project.find({ student: studentId })
      .populate('supervisor', 'fullName email matricNumber')
      .populate('student', 'fullName email matricNumber');

    res.json({ student: student.fullName, projects });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch student projects', error: err.message });
  }
};
