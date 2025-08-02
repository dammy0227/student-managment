import { createSlice } from '@reduxjs/toolkit';
import {
  sendMessage,
  fetchMessages,
  markMessagesAsRead,
  fetchUnreadMessages,
} from './messageThunks';

const initialState = {
  messages: [],           // All chat messages
  unreadMessages: [],     // Only unread messages
  loading: false,
  error: null,
};

const messageSlice = createSlice({
  name: 'message',
  initialState,
  reducers: {
    clearMessages: (state) => {
      state.messages = [];
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Send message
      .addCase(sendMessage.pending, (state) => {
        state.loading = true;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.loading = false;
        state.messages.push(action.payload);
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch full chat messages
      .addCase(fetchMessages.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.loading = false;
        state.messages = action.payload;
      })
      .addCase(fetchMessages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Mark as read
      .addCase(markMessagesAsRead.fulfilled, (state, action) => {
        const senderId = action.payload;
        state.messages = state.messages.map((msg) =>
          msg.sender === senderId ? { ...msg, isRead: true } : msg
        );

        // Also remove from unreadMessages
        state.unreadMessages = state.unreadMessages.filter(
          (msg) => msg.sender !== senderId
        );
      })

      // Fetch unread messages separately
      .addCase(fetchUnreadMessages.fulfilled, (state, action) => {
        state.unreadMessages = action.payload;
      });
  },
});

// ✅ Export actions
export const { clearMessages } = messageSlice.actions;

export const selectUnreadMessagesCount = (state, currentUserId) => {
  const messageState = state.chat; // ✅ corrected from `state.message`

  if (
    !messageState ||
    !messageState.unreadMessages ||
    !currentUserId
  ) {
    return 0;
  }

  return messageState.unreadMessages.filter(
    (msg) => msg.receiver === currentUserId && !msg.isRead
  ).length;
};

// ✅ Export reducer
export default messageSlice.reducer;
