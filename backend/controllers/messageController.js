const Message = require('../models/Message');
const Project = require('../models/Project');
const Notification = require('../models/Notification');

// 📩 Send a Message (Student ↔ Supervisor)
exports.sendMessage = async (req, res) => {
  try {
    const { receiverId, content } = req.body;

    // 🔐 Permission Check
    if (req.user.role === 'Student') {
      const project = await Project.findOne({ student: req.user.id });

      if (!project || project.supervisor.toString() !== receiverId) {
        return res.status(403).json({ message: 'You can only message your assigned supervisor' });
      }
    }

    if (req.user.role === 'Supervisor') {
      const project = await Project.findOne({ student: receiverId });

      if (!project || project.supervisor.toString() !== req.user.id) {
        return res.status(403).json({ message: 'You can only message your assigned student' });
      }
    }

    // ✅ Save the message
    const message = new Message({
      sender: req.user.id,
      receiver: receiverId,
      content,
    });

    await message.save();

    // ✅ Safe fallback for user name in notification
    const senderName =
      req.user.fullName ||
      req.user.name ||
      `${req.user.firstName || ''} ${req.user.lastName || ''}`.trim() ||
      'a user';

    // ✅ Create a notification for the receiver
    try {
      await Notification.create({
        user: receiverId,
        message: `New message from ${senderName}`,
        link: `/${req.user.role.toLowerCase()}/chat`,
      });
    } catch (notifErr) {
      console.error('❌ Notification creation error:', notifErr.message);
    }

    // ✅ Emit real-time message using socket.io if available
    if (global._io) {
      global._io.to(receiverId).emit('newMessage', {
        sender: req.user.id,
        receiver: receiverId,
        content,
        createdAt: message.createdAt,
      });
    }

    // ✅ Return response to sender
    res.status(201).json({ message: 'Message sent', chat: message });

  } catch (err) {
    console.error('❌ Error sending message:', err.message);
    res.status(500).json({ message: 'Failed to send message' });
  }
};

// 📥 Fetch messages with a specific user
exports.getMessages = async (req, res) => {
  try {
    const { userId } = req.params; // The ID of the other user in chat

    // Validate chat permissions
    if (req.user.role === 'Student') {
      const project = await Project.findOne({ student: req.user.id });
      if (!project || project.supervisor.toString() !== userId) {
        return res.status(403).json({ message: 'You can only chat with your assigned supervisor' });
      }
    }

    if (req.user.role === 'Supervisor') {
      const project = await Project.findOne({ student: userId });
      if (!project || project.supervisor.toString() !== req.user.id) {
        return res.status(403).json({ message: 'You can only chat with your assigned student' });
      }
    }

    const messages = await Message.find({
      $or: [
        { sender: req.user.id, receiver: userId },
        { sender: userId, receiver: req.user.id },
      ],
    }).sort({ createdAt: 1 });

    res.status(200).json(messages);
  } catch (err) {
    console.error('❌ Error fetching messages:', err.message);
    res.status(500).json({ message: 'Failed to fetch messages', error: err.message });
  }
};

// ✅ Mark all messages from a specific user as read
exports.markMessagesAsRead = async (req, res) => {
  try {
    const { userId } = req.body;

    await Message.updateMany(
      {
        sender: userId,
        receiver: req.user.id,
        isRead: false,
      },
      { $set: { isRead: true } }
    );

    res.json({ message: 'Messages marked as read' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to mark messages as read', error: err.message });
  }
};

// ✅ Get all unread messages for current user
exports.getUnreadMessages = async (req, res) => {
  try {
    const messages = await Message.find({
      receiver: req.user.id,
      isRead: false,
    });

    res.status(200).json(messages);
  } catch (err) {
    res.status(500).json({ message: 'Failed to get unread messages', error: err.message });
  }
};
