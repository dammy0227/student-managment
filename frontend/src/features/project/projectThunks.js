// src/features/project/projectThunks.js
import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../services/api';
import { PROJECTS } from '../../services/endpoints';

export const submitProject = createAsyncThunk(
  'project/submitProject',
  async (data, { rejectWithValue }) => {
    try {
      const res = await axios.post(PROJECTS.SUBMIT, data);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Proposal submission failed');
    }
  }
);

export const fetchMyProjects = createAsyncThunk(
  'project/fetchMyProjects',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(PROJECTS.MINE);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch student projects');
    }
  }
);

export const fetchAllProjects = createAsyncThunk(
  'project/fetchAllProjects',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(PROJECTS.ALL);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch all projects');
    }
  }
);

export const getSingleProject = createAsyncThunk(
  'project/getSingleProject',
  async (id, { rejectWithValue }) => {
    try {
      const res = await axios.get(PROJECTS.SINGLE(id));
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch project');
    }
  }
);

export const assignSupervisorToProject = createAsyncThunk(
  'project/assignSupervisor',
  async ({ projectId, supervisorId }, { rejectWithValue }) => {
    try {
      const res = await axios.patch(PROJECTS.ASSIGN_SUPERVISOR(projectId), {
        supervisorId,
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Supervisor assignment failed');
    }
  }
);

export const updateProjectStatus = createAsyncThunk(
  'project/updateStatus',
  async ({ projectId, status }, { rejectWithValue }) => {
    try {
      const res = await axios.patch(PROJECTS.STATUS(projectId), {
        status,
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Status update failed');
    }
  }
);

export const fetchUnreadProjectCount = createAsyncThunk(
  'projectNotification/fetchUnreadCount',
  async (_, thunkAPI) => {
    try {
      const res = await axios.get(PROJECTS.UNREAD_COUNT);
      return res.data;
    } catch {
      return thunkAPI.rejectWithValue('Failed to fetch unread project count');
    }
  }
);

export const markProjectsAsRead = createAsyncThunk(
  'projectNotification/markAsRead',
  async (_, thunkAPI) => {
    try {
      await axios.patch(PROJECTS.MARK_AS_READ);
    } catch {
      return thunkAPI.rejectWithValue('Failed to mark projects as read');
    }
  }
);

export const fetchProjectsByStudent = createAsyncThunk(
  'project/fetchProjectsByStudent',
  async (studentId, { rejectWithValue }) => {
    try {
      const res = await axios.get(`/api/projects/student/${studentId}`);
      return {
        student: { _id: studentId }, // structure to match selectedStudent
        projects: res.data,
      };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch student projects');
    }
  }
);
