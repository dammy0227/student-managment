const CalendarEvent = require('../models/CalendarEvent');
const Project = require('../models/Project');
const Notification = require('../models/Notification');
const User = require('../models/User');

// 📅 Get all calendar events for a student
exports.getEventsByStudent = async (req, res) => {
  try {
    const { studentId } = req.params;

    const project = await Project.findOne({ student: studentId });
    if (!project) {
      return res.status(404).json({ message: 'Project not found for this student' });
    }

    const events = await CalendarEvent.find({ project: project._id });
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch calendar events', error: err.message });
  }
};

// ✅ Create a new calendar event for a student (called by Supervisor)
exports.createEventByStudent = async (req, res) => {
  try {
    const { title, date, description, type, studentId } = req.body;

    if (!studentId) {
      return res.status(400).json({ message: 'Student ID is required' });
    }

    const project = await Project.findOne({ student: studentId });
    if (!project) {
      return res.status(404).json({ message: 'Project not found for this student' });
    }

    const newEvent = new CalendarEvent({
      title,
      date,
      description,
      type,
      project: project._id,
      createdBy: req.user._id,
    });

    await newEvent.save();

    // 🔔 Notify student in real-time
    if (global._io) {
      global._io.to(studentId).emit('newCalendarEvent', {
        _id: newEvent._id,
        title: newEvent.title,
        date: newEvent.date,
        description: newEvent.description,
        type: newEvent.type,
        project: newEvent.project,
        createdBy: newEvent.createdBy,
      });
    }

    // 🔔 Create notification for supervisor (optional: can reverse this if needed)
    const student = await User.findById(studentId);
    if (student?.supervisorId) {
      await Notification.create({
        user: student.supervisorId,
        message: 'A new calendar event has been added for your student',
        link: `/supervisor/student/${studentId}/calendar`,
      });
    }

    res.status(201).json(newEvent);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create event', error: err.message });
  }
};

// 🔍 Get unread calendar event count for a student's project
exports.getUnreadEventCount = async (req, res) => {
  try {
    const { studentId } = req.params;
    const project = await Project.findOne({ student: studentId });

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const count = await CalendarEvent.countDocuments({
      project: project._id,
      isReadBySupervisor: false,
    });

    res.json({ count });
  } catch (err) {
    res.status(500).json({ message: 'Failed to count unread events', error: err.message });
  }
};

// ✅ Mark all calendar events as read for a student (supervisor use)
exports.markCalendarAsRead = async (req, res) => {
  try {
    const { studentId } = req.params;
    const project = await Project.findOne({ student: studentId });

    if (!project) {
      return res.status(404).json({ message: 'Project not found for this student' });
    }

    await CalendarEvent.updateMany(
      { project: project._id, isReadBySupervisor: false },
      { $set: { isReadBySupervisor: true } }
    );

    res.json({ message: 'Calendar events marked as read' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to mark calendar events as read', error: err.message });
  }
};
