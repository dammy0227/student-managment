import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../services/api';
import { FILES } from '../../services/endpoints';

// POST file upload
export const uploadFile = createAsyncThunk(
  'file/uploadFile',
  async ({ file, projectId }, thunkAPI) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('projectId', projectId); // ✅ This MUST be here

      console.log('Sending projectId:', projectId); // ✅ Add this for debugging

      const res = await axios.post('/files/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || 'Upload failed'
      );
    }
  }
);


// GET all files for a project
export const fetchFiles = createAsyncThunk(
  'file/fetchFiles',
  async (projectId, thunkAPI) => {
    try {
      const res = await axios.get(FILES.BY_PROJECT(projectId));
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || 'Failed to fetch files');
    }
  }
);


export const fetchSupervisorFiles = createAsyncThunk(
  'file/fetchSupervisorFiles',
  async (_, thunkAPI) => {
    try {
      const res = await axios.get(FILES.FOR_SUPERVISOR);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || 'Failed to fetch supervisor files');
    }
  }
);


// PUT: Approve or Reject a document
export const updateDocumentStatus = createAsyncThunk(
  'file/updateDocumentStatus',
  async ({ documentId, status }, thunkAPI) => {
    try {
      const res = await axios.put(FILES.UPDATE_STATUS(documentId), { status });
      return res.data.document; // return updated document
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || 'Failed to update file status'
      );
    }
  }
)


export const fetchUnreadFileCount = createAsyncThunk(
  'fileNotification/fetchUnreadCount',
  async (_, thunkAPI) => {
    try {
      const res = await axios.get(FILES.UNREAD_COUNT);
      return res.data;
    } catch  {
      return thunkAPI.rejectWithValue('Failed to fetch unread file count');
    }
  }
);

export const markFilesAsRead = createAsyncThunk(
  'fileNotification/markAsRead',
  async (_, thunkAPI) => {
    try {
      await axios.patch(FILES.MARK_AS_READ);
    } catch  {
      return thunkAPI.rejectWithValue('Failed to mark files as read');
    }
  }
);