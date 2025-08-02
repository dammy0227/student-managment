import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../services/api';
import { NOTIFICATIONS } from '../../services/endpoints';

// 🔔 For supervisor or current user
export const fetchNotifications = createAsyncThunk(
  'notification/fetchNotifications',
  async (_, thunkAPI) => {
    try {
      const res = await axios.get(NOTIFICATIONS.LIST);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || 'Failed to load notifications'
      );
    }
  }
);

// ✅ For student only (renamed to avoid conflict)
export const getNotificationsForStudent = createAsyncThunk(
  'notification/fetchNotificationsByStudent', // 🔵 NEW UNIQUE TYPE
  async (studentId, thunkAPI) => {
    try {
      const res = await axios.get(NOTIFICATIONS.BY_STUDENT(studentId));
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || 'Failed to load student notifications'
      );
    }
  }
);

// ✅ Mark all notifications as read
export const markAllAsRead = createAsyncThunk(
  'notification/markAllAsRead',
  async (_, thunkAPI) => {
    try {
      const res = await axios.patch(NOTIFICATIONS.MARK_ALL_AS_READ);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || 'Failed to mark all as read'
      );
    }
  }
);
