// src/features/calendar/calendarSlice.js
import { createSlice } from '@reduxjs/toolkit';
import { fetchEvents, createEvent , fetchUnreadCalendarCount, markCalendarAsRead} from './calendarThunks';

const initialState = {
  events: [],
  loading: false,
  error: null,
   unreadCount: 0, // 🆕
};

const calendarSlice = createSlice({
  name: 'calendar',
  initialState,
  reducers: {
    clearCalendarState: (state) => {
      state.events = [];
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEvents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEvents.fulfilled, (state, action) => {
        state.loading = false;
        state.events = action.payload;
      })
      .addCase(fetchEvents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createEvent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createEvent.fulfilled, (state, action) => {
        state.loading = false;
        state.events.push(action.payload);
      })
      .addCase(createEvent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchUnreadCalendarCount.fulfilled, (state, action) => {
  state.unreadCount = action.payload;
})
.addCase(markCalendarAsRead.fulfilled, (state) => {
  state.unreadCount = 0; // reset
})

  },
});

export const { clearCalendarState } = calendarSlice.actions;

export default calendarSlice.reducer;

export const selectCalendarEvents = (state) => state.calendar.events;
export const selectCalendarLoading = (state) => state.calendar.loading;
export const selectCalendarError = (state) => state.calendar.error;
export const selectUnreadCalendarCount = (state) => state.calendar.unreadCount;

