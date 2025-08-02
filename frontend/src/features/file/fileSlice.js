// src/features/file/fileSlice.js

import { createSlice } from '@reduxjs/toolkit';
import {
  uploadFile,
  fetchFiles,
  fetchSupervisorFiles,
  updateDocumentStatus,
  fetchUnreadFileCount,
  markFilesAsRead,
} from './fileThunks';

const initialState = {
  files: [],
  loading: false,
  error: null,
  successMessage: '',
  unreadCount: 0, 
};

const fileSlice = createSlice({
  name: 'file',
  initialState,
  reducers: {
    clearFiles: (state) => {
      state.files = [];
      state.loading = false;
      state.error = null;
      state.successMessage = '';
    },
    clearUploadStatus: (state) => {
      state.successMessage = '';
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Upload file
      .addCase(uploadFile.pending, (state) => {
        state.loading = true;
        state.successMessage = '';
        state.error = null;
      })
      .addCase(uploadFile.fulfilled, (state, action) => {
        state.loading = false;
        state.files.push(action.payload.document);
        state.successMessage = 'File uploaded successfully';
      })
      .addCase(uploadFile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Upload failed';
        state.successMessage = '';
      })

      // Fetch files
      .addCase(fetchFiles.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFiles.fulfilled, (state, action) => {
        state.loading = false;
        state.files = action.payload;
      })
      .addCase(fetchFiles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch files';
      })

      // Fetch supervisor's assigned files
      .addCase(fetchSupervisorFiles.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSupervisorFiles.fulfilled, (state, action) => {
        state.loading = false;
        state.files = action.payload;
      })
      .addCase(fetchSupervisorFiles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch supervisor files';
      })

      // Update file status
      .addCase(updateDocumentStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateDocumentStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = 'Status updated successfully';
        const updatedDoc = action.payload;
        state.files = state.files.map((doc) =>
          doc._id === updatedDoc._id ? updatedDoc : doc
        );
      })
      .addCase(updateDocumentStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to update document status';
      })

      // Fetch unread count
      .addCase(fetchUnreadFileCount.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUnreadFileCount.fulfilled, (state, action) => {
        state.loading = false;
        state.unreadCount = action.payload.count;
      })
      .addCase(fetchUnreadFileCount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Mark as read
      .addCase(markFilesAsRead.fulfilled, (state) => {
        state.unreadCount = 0;
      });
  },
});

// ✅ Actions
export const { clearFiles, clearUploadStatus } = fileSlice.actions;

// ✅ Selectors
export const selectFiles = (state) => state.file.files;
export const selectFileLoading = (state) => state.file.loading;
export const selectFileError = (state) => state.file.error;
export const selectUnreadFileCount = (state) => state.file.unreadCount 




// ✅ Reducer
export default fileSlice.reducer;