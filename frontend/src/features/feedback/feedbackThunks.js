import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../services/api';
import { FEEDBACK } from '../../services/endpoints';

// ✅ GET feedbacks for a student
export const fetchFeedback = createAsyncThunk(
  'feedback/fetchFeedback',
  async (studentId, thunkAPI) => {
    try {
      const res = await axios.get(FEEDBACK.VIEW_BY_STUDENT(studentId));
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || 'Failed to fetch feedback');
    }
  }
);

// ✅ POST feedback to a student
export const submitFeedback = createAsyncThunk(
  'feedback/submitFeedback',
  async ({ studentId, chapterTitle, comment, score }, thunkAPI) => {
    try {
      const res = await axios.post(FEEDBACK.SEND, {
        studentId,
        chapterTitle,
        comment,
        score,
      });
      return res.data.feedback;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || 'Failed to submit feedback');
    }
  }
);

// ✅ UPDATE feedback
export const updateFeedback = createAsyncThunk(
  'feedback/updateFeedback',
  async ({ feedbackId, chapterTitle, comment, score }, thunkAPI) => {
    try {
      const res = await axios.put(FEEDBACK.UPDATE(feedbackId), {
        chapterTitle,
        comment,
        score,
      });
      return res.data.feedback;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || 'Failed to update feedback');
    }
  }
);

// ✅ DELETE feedback
export const deleteFeedback = createAsyncThunk(
  'feedback/deleteFeedback',
  async (feedbackId, thunkAPI) => {
    try {
      await axios.delete(FEEDBACK.DELETE(feedbackId));
      return feedbackId;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || 'Failed to delete feedback');
    }
  }
);

// ✅ FETCH unread feedback count
export const fetchUnreadFeedbackCount = createAsyncThunk(
  'feedback/fetchUnreadFeedbackCount',
  async (_, thunkAPI) => {
    try {
      const res = await axios.get(FEEDBACK.UNREAD_COUNT);
      return res.data.count;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || 'Failed to fetch unread feedback count');
    }
  }
);

// ✅ MARK feedback as read
export const markFeedbackAsRead = createAsyncThunk(
  'feedback/markFeedbackAsRead',
  async (_, thunkAPI) => {
    try {
      await axios.put(FEEDBACK.MARK_AS_READ);
      return true;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || 'Failed to mark feedback as read');
    }
  }
);
  