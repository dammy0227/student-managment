import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../services/api';
import {AUTH} from '../../services/endpoints';

// Login
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (credentials, { rejectWithValue }) => {
    try {
      const res = await axios.post(AUTH.LOGIN, credentials);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Login failed');
    }
  }
);

// Register
export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (data, { rejectWithValue }) => {
    try {
      const res = await axios.post(AUTH.REGISTER, data);
      return res.data;
    } catch (err) {
      console.error(err)
      return rejectWithValue(err.response?.data?.message || 'Registration failed');
    }
  }
);

// Get logged-in user's profile
export const getUserProfile = createAsyncThunk(
  'auth/getUserProfile',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(AUTH.PROFILE);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch profile');
    }
  }
);
