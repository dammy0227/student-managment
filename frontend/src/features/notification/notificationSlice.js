import { createSlice } from '@reduxjs/toolkit';
import {
  fetchNotifications,
  markAllAsRead,
  getNotificationsForStudent
} from './notificationThunks';

const initialState = {
  notifications: [],
  studentNotifications: [],
  loading: false,
  error: null,
};

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    clearNotifications: (state) => {
      state.notifications = [];
      state.studentNotifications = [];
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.notifications = action.payload;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(markAllAsRead.fulfilled, (state) => {
        state.notifications = state.notifications.map((n) => ({
          ...n,
          isRead: true,
        }));
      })
      .addCase(getNotificationsForStudent.fulfilled, (state, action) => {
        state.loading = false;
        state.studentNotifications = action.payload;
      });
  },
});

export const { clearNotifications } = notificationSlice.actions;

// ✅ Selectors
export const selectNotifications = (state) => state.notification.notifications;
export const selectUnreadNotifications = (state) =>
  state.notification.notifications.filter((n) => !n.isRead);
export const selectUnreadCount = (state) =>
  state.notification.notifications.filter((n) => !n.isRead).length;
export const selectNotificationLoading = (state) => state.notification.loading;
export const selectNotificationError = (state) => state.notification.error;
export const selectAllNotifications = (state) => state.notification.notifications;
export const selectStudentNotifications = (state) =>
  state.notification.studentNotifications;

export default notificationSlice.reducer;
