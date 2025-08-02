const Task = require('../models/Task');

// Create Task (Supervisor)
exports.createTask = async (req, res) => {
  try {
    const { projectId, title, deadline, priority, notes } = req.body;

    const task = new Task({
      project: projectId,
      title,
      deadline,
      priority,
      notes,
    });

    await task.save();
    res.status(201).json({ message: 'Task created', task });
  } catch (err) {
    res.status(500).json({ message: 'Failed to create task' });
  }
};

// Get Tasks by Project
exports.getProjectTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ project: req.params.projectId });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: 'Failed to get tasks' });
  }
};

// Update Task Progress (e.g., toggle complete)
exports.updateTaskStatus = async (req, res) => {
  try {
    const { isCompleted } = req.body;

    const task = await Task.findByIdAndUpdate(
      req.params.taskId,
      { isCompleted },
      { new: true }
    );

    res.json({ message: 'Task updated', task });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update task' });
  }
};
