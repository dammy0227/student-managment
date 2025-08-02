import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../services/api';
import { MESSAGES } from '../../services/endpoints';

// POST send message
// Send message
export const sendMessage = createAsyncThunk(
  'message/sendMessage',
  async ({ receiverId, content }, thunkAPI) => {
    try {
      const res = await axios.post(MESSAGES.SEND, {
        receiverId,
        content,
      });

      const currentUserId = thunkAPI.getState().auth.user._id;

      return {
        ...res.data.chat,
        isSender: res.data.chat.sender === currentUserId,
      };
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || 'Failed to send message');
    }
  }
);

export const fetchMessages = createAsyncThunk(
  'message/fetchMessages',
  async (userId, thunkAPI) => {
    const res = await axios.get(MESSAGES.GET(userId));
    const currentUserId = thunkAPI.getState().auth.user._id;

    return res.data.map(msg => ({
      ...msg,
      isSender: msg.sender === currentUserId,
    }));
  }
);

export const markMessagesAsRead = createAsyncThunk(
  'message/markMessagesAsRead',
  async (userId, thunkAPI) => {
    try {
      await axios.patch('/messages/read', { userId });

      // 🔄 Refresh unread messages after marking as read
      thunkAPI.dispatch(fetchUnreadMessages());

      return userId;
    } catch {
      return thunkAPI.rejectWithValue('Failed to mark messages as read');
    }
  }
);



export const fetchUnreadMessages = createAsyncThunk(
  'message/fetchUnreadMessages',
  async (_, thunkAPI) => {
    try {
      const res = await axios.get('/messages/unread/all');
      const currentUserId = thunkAPI.getState().auth.user._id;

      return res.data.map(msg => ({
        ...msg,
        isSender: msg.sender === currentUserId,
      }));
    } catch  {
      return thunkAPI.rejectWithValue('Failed to fetch unread messages');
    }
  }
);
