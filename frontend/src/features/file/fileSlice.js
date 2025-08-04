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
      // 📤 Upload File
      .addCase(uploadFile.pending, (state) => {
        state.loading = true;
        state.successMessage = '';
        state.error = null;
      })
      .addCase(uploadFile.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload?.document) {
          state.files.push(action.payload.document);
        }
        state.successMessage = 'File uploaded successfully';
      })
      .addCase(uploadFile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error?.message || 'Upload failed';
        state.successMessage = '';
      })

      // 📁 Fetch Project Files
      .addCase(fetchFiles.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFiles.fulfilled, (state, action) => {
        state.loading = false;
        state.files = action.payload || [];
      })
      .addCase(fetchFiles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error?.message || 'Failed to fetch files';
      })

      // 👨‍🏫 Fetch Supervisor Files
      .addCase(fetchSupervisorFiles.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSupervisorFiles.fulfilled, (state, action) => {
        state.loading = false;
        state.files = action.payload || [];
      })
      .addCase(fetchSupervisorFiles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error?.message || 'Failed to fetch supervisor files';
      })

      // ✅ Update Document Status
      .addCase(updateDocumentStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateDocumentStatus.fulfilled, (state, action) => {
        state.loading = false;
        const updatedDoc = action.payload;
        if (updatedDoc) {
          state.files = state.files.map((doc) =>
            doc._id === updatedDoc._id ? updatedDoc : doc
          );
        }
        state.successMessage = 'Status updated successfully';
      })
      .addCase(updateDocumentStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error?.message || 'Failed to update document status';
      })

      // 🔔 Fetch Unread Count
      .addCase(fetchUnreadFileCount.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUnreadFileCount.fulfilled, (state, action) => {
        state.loading = false;
        state.unreadCount = action.payload?.count ?? 0;
      })
      .addCase(fetchUnreadFileCount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error?.message || 'Failed to fetch unread file count';
      })

      // ✔️ Mark Files as Read
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
export const selectUnreadFileCount = (state) => state.file.unreadCount;

// ✅ Reducer
export default fileSlice.reducer;
