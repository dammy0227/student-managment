import Feedback from '../models/Feedback.js';
import User from '../models/User.js';
import Project from '../models/Project.js';
import Notification from '../models/Notification.js';

export const sendFeedback = async (req, res) => {
  try {
    const { studentId, chapterTitle, comment, score } = req.body;

    const project = await Project.findOne({ student: studentId });
    if (!project) {
      return res.status(404).json({ message: 'No project found for this student' });
    }

    const feedback = new Feedback({
      student: studentId,
      supervisor: req.user.id,
      chapterTitle,
      comment,
      score,
    });

    await feedback.save();

    await Notification.create({
      user: studentId,
      message: 'You received new feedback from your supervisor',
      link: `/student/feedback`,
    });

    if (global._io) {
      global._io.to(studentId).emit('newFeedback', {
        chapterTitle,
        comment,
        score,
        createdAt: feedback.createdAt,
        supervisorName: req.user.fullName,
      });
    }

    res.status(201).json({ message: 'Feedback sent successfully', feedback });
  } catch (err) {
    res.status(500).json({ message: 'Failed to send feedback' });
  }
};

export const getFeedbackForStudent = async (req, res) => {
  try {
    const studentId = req.params.studentId;

    const isStudent = req.user._id?.toString() === studentId.toString();
    const isAdmin = req.user.role === 'Admin';

    const student = await User.findById(studentId);
    const isSupervisor = student?.supervisorId?.toString() === req.user._id?.toString();

    if (!isStudent && !isAdmin && !isSupervisor) {
      return res.status(403).json({ message: 'Access denied: insufficient role' });
    }

    const feedbacks = await Feedback.find({ student: studentId })
      .populate('supervisor', 'fullName email')
      .sort({ createdAt: -1 });

    res.json(feedbacks);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch feedback' });
  }
};

export const updateFeedback = async (req, res) => {
  try {
    const feedbackId = req.params.feedbackId;
    const { chapterTitle, comment, score } = req.body;

    const feedback = await Feedback.findById(feedbackId);
    if (!feedback) {
      return res.status(404).json({ message: 'Feedback not found' });
    }

    if (feedback.supervisor.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this feedback' });
    }

    feedback.chapterTitle = chapterTitle || feedback.chapterTitle;
    feedback.comment = comment || feedback.comment;

    if (typeof score === 'number' && score >= 0 && score <= 20) {
      feedback.score = score;
    }

    await feedback.save();

    res.json({ message: 'Feedback updated successfully', feedback });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update feedback' });
  }
};

export const deleteFeedback = async (req, res) => {
  try {
    const feedbackId = req.params.feedbackId;

    const feedback = await Feedback.findById(feedbackId);
    if (!feedback) {
      return res.status(404).json({ message: 'Feedback not found' });
    }

    if (feedback.supervisor.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this feedback' });
    }

    await feedback.deleteOne();

    res.json({ message: 'Feedback deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete feedback' });
  }
};

export const markFeedbackAsRead = async (req, res) => {
  try {
    await Feedback.updateMany(
      { student: req.user.id, isReadByStudent: false },
      { isReadByStudent: true }
    );
    res.json({ message: 'Feedback marked as read' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to mark feedback as read' });
  }
};

export const getUnreadFeedbackCount = async (req, res) => {
  try {
    const count = await Feedback.countDocuments({
      student: req.user.id,
      isReadByStudent: false,
    });
    res.json({ count });
  } catch (err) {
    res.status(500).json({ message: 'Failed to get unread feedback count' });
  }
};
