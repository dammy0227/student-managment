import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../services/api';
import { USERS } from '../../services/endpoints';

export const fetchAllStudents = createAsyncThunk(
  'user/fetchAllStudents',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(USERS.STUDENTS);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to load students');
    }
  }
);

export const fetchAllSupervisors = createAsyncThunk(
  'user/fetchAllSupervisors',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(USERS.SUPERVISORS);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to load supervisors');
    }
  }
);

export const fetchUserById = createAsyncThunk(
  'user/fetchUserById',
  async (id, { rejectWithValue }) => {
    try {
      const res = await axios.get(USERS.BY_ID(id));
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'User not found');
    }
  }
);

export const updateUserRole = createAsyncThunk(
  'user/updateUserRole',
  async ({ id, role }, { rejectWithValue }) => {
    try {
      const res = await axios.patch(USERS.UPDATE_ROLE(id), { role });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Role update failed');
    }
  }
);

export const createSupervisor = createAsyncThunk(
  'user/createSupervisor',
  async (data, { rejectWithValue }) => {
    try {
      const res = await axios.post(USERS.CREATE_SUPERVISOR, {
        ...data,
        role: 'Supervisor',
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Supervisor creation failed');
    }
  }
);

export const assignSupervisorToStudent = createAsyncThunk(
  'user/assignSupervisorToStudent',
  async ({ studentId, supervisorId }, { rejectWithValue }) => {
    try {
      const response = await axios.patch(USERS.ASSIGN_SUPERVISOR_TO_STUDENT(studentId), {
        supervisorId,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to assign supervisor');
    }
  }
);

export const fetchMyStudents = createAsyncThunk(
  'user/fetchMyStudents',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get('/users/my-students');
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch my students');
    }
  }
);
