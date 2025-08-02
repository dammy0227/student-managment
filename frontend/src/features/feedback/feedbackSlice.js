import { createSlice } from '@reduxjs/toolkit';
import { fetchFeedback, submitFeedback, deleteFeedback, updateFeedback, fetchUnreadFeedbackCount, markFeedbackAsRead } from './feedbackThunks';

const initialState = {
  feedbackList: [],
  loading: false,
  error: null,
  unreadCount: 0,
};

const feedbackSlice = createSlice({
  name: 'feedback',
  initialState,
  reducers: {
    clearFeedbackState: (state) => {
      state.feedbackList = [];
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeedback.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFeedback.fulfilled, (state, action) => {
        state.loading = false;
        state.feedbackList = action.payload;
      })
      .addCase(fetchFeedback.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(submitFeedback.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(submitFeedback.fulfilled, (state, action) => {
        state.loading = false;
        state.feedbackList.push(action.payload); // push the new feedback
      })
      .addCase(submitFeedback.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
            // ✅ UPDATE feedback
      .addCase(updateFeedback.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.feedbackList.findIndex(f => f._id === action.payload._id);
        if (index !== -1) {
          state.feedbackList[index] = action.payload;
        }
      })
      .addCase(updateFeedback.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ✅ DELETE feedback
      .addCase(deleteFeedback.fulfilled, (state, action) => {
        state.loading = false;
        state.feedbackList = state.feedbackList.filter(f => f._id !== action.payload);
      })
      .addCase(deleteFeedback.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

            // ✅ Handle Unread Feedback Count
      .addCase(fetchUnreadFeedbackCount.fulfilled, (state, action) => {
        state.unreadCount = action.payload;
      })
      .addCase(fetchUnreadFeedbackCount.rejected, (state, action) => {
        state.error = action.payload;
      })

      // ✅ Mark Feedback As Read
      .addCase(markFeedbackAsRead.fulfilled, (state) => {
        state.unreadCount = 0;
      })
      .addCase(markFeedbackAsRead.rejected, (state, action) => {
        state.error = action.payload;
      })

      

  },
});

export const { clearFeedbackState } = feedbackSlice.actions;
export default feedbackSlice.reducer;

export const selectFeedback = (state) => state.feedback.feedbackList;
export const selectFeedbackLoading = (state) => state.feedback.loading;
export const selectUnreadFeedbackCount = (state) => state.feedback.unreadCount;
export const selectFeedbackError = (state) => state.feedback.error;
