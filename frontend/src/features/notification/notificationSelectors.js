export const selectNotifications = (state) => state.notification.notifications;
export const selectUnreadNotifications = (state) =>
  state.notification.notifications.filter((n) => !n.read);
export const selectNotificationLoading = (state) => state.notification.loading;
export const selectNotificationError = (state) => state.notification.error; // ✅ ensure this exists
