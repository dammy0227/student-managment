import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../services/api';
import { TASKS } from '../../services/endpoints';

// Fetch all tasks for a specific project
export const fetchTasksByProject = createAsyncThunk(
  'task/fetchTasksByProject',
  async (projectId, thunkAPI) => {
    try {
      const res = await axios.get(`${TASKS.tasks}/${projectId}`);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || 'Failed to load tasks');
    }
  }
);

// Create a new task
export const createTask = createAsyncThunk(
  'task/createTask',
  async (taskData, thunkAPI) => {
    try {
      const res = await axios.post(TASKS.tasks, taskData);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || 'Failed to create task');
    }
  }
);

// Update task status
export const updateTaskStatus = createAsyncThunk(
  'task/updateTaskStatus',
  async ({ taskId, status }, thunkAPI) => {
    try {
      const res = await axios.patch(`${TASKS.tasks}/${taskId}/status`, { isCompleted: status });
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || 'Failed to update task status');
    }
  }
);
