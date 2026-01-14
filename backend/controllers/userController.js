import User from '../models/User.js';
import bcrypt from 'bcryptjs';

export const createSupervisor = async (req, res) => {
  const { fullName, email, password } = req.body;

  try {
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: 'Supervisor already exists' });
    }

    const supervisor = new User({
      fullName,
      email: email.toLowerCase(),
      password,
      role: 'Supervisor',
    });

    await supervisor.save();

    res.status(201).json({
      message: 'Supervisor created successfully',
      supervisor: {
        id: supervisor._id,
        fullName: supervisor.fullName,
        email: supervisor.email,
        role: supervisor.role,
      },
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

export const getAllStudents = async (req, res) => {
  try {
    const students = await User.find({ role: 'Student' }).select('-password');
    res.json(students);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch students' });
  }
};

export const getAllSupervisors = async (req, res) => {
  try {
    const supervisors = await User.find({ role: 'Supervisor' }).select('-password');
    res.json(supervisors);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch supervisors' });
  }
};

export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch user' });
  }
};

export const updateUserRole = async (req, res) => {
  const { role } = req.body;
  if (!['Student', 'Supervisor', 'admin'].includes(role)) {
    return res.status(400).json({ message: 'Invalid role' });
  }

  try {
    const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true }).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'User role updated', user });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update user role' });
  }
};

export const assignStudentToSupervisor = async (req, res) => {
  const { supervisorId } = req.body;
  const studentId = req.params.id;

  try {
    const student = await User.findById(studentId);
    if (!student || student.role !== 'Student') return res.status(404).json({ message: 'Student not found' });

    const supervisor = await User.findById(supervisorId);
    if (!supervisor || supervisor.role !== 'Supervisor') return res.status(404).json({ message: 'Supervisor not found' });

    student.supervisorId = supervisorId;
    await student.save();

    if (!supervisor.students.includes(studentId)) {
      supervisor.students.push(studentId);
      await supervisor.save();
    }

    res.status(200).json({ message: 'Student assigned to supervisor', student });
  } catch (err) {
    res.status(500).json({ message: 'Failed to assign', error: err.message });
  }
};

export const getMyStudents = async (req, res) => {
  try {
    const supervisorId = req.user._id;
    const students = await User.find({ role: 'Student', supervisorId });
    res.status(200).json(students);
  } catch (error) {
    res.status(500).json({ message: 'Server error while fetching students' });
  }
};
