// src/features/calendar/calendarThunks.js
import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../services/api';
import { CALENDAR } from '../../services/endpoints';


export const fetchEvents = createAsyncThunk(
  'calendar/fetchEvents',
  async (studentId, thunkAPI) => {
    try {
      const res = await axios.get(CALENDAR.GET_BY_STUDENT(studentId));
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || 'Failed to fetch events');
    }
  }
);

export const createEvent = createAsyncThunk(
  'calendar/createEvent',
  async (eventData, thunkAPI) => {
    try {
      const res = await axios.post(CALENDAR.ADD, eventData);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || 'Failed to create event');
    }
  }
);


// src/features/calendar/calendarThunks.js
export const fetchUnreadCalendarCount = createAsyncThunk(
  'calendar/fetchUnreadCalendarCount',
  async (studentId, thunkAPI) => {
    try {
      const res = await axios.get(CALENDAR.UNREAD_COUNT(studentId));
      return res.data.count;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || 'Failed to get unread calendar count');
    }
  }
);

export const markCalendarAsRead = createAsyncThunk(
  'calendar/markCalendarAsRead',
  async (studentId, thunkAPI) => {
    try {
      const res = await axios.put(CALENDAR.MARK_AS_READ(studentId));
      return res.data.success;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || 'Failed to mark calendar as read');
    }
  }
);
