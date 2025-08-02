// store/rootReducer.js
import { combineReducers } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import projectReducer from '../features/project/projectSlice';
import notificationReducer from '../features/notification/notificationSlice';
import fileReducer from '../features/file/fileSlice';
import calendarReducer from '../features/calendar/calendarSlice';
import feedbackReducer from '../features/feedback/feedbackSlice';
import messageReducer from '../features/message/messageSlice';
import userReducer from '../features/user/userSlice'; // ✅ fixed double slash

const rootReducer = combineReducers({
  auth: authReducer,
  project: projectReducer,
  notification: notificationReducer,
  file: fileReducer,
  calendar: calendarReducer,
  feedback: feedbackReducer,     // ✅ feedback slice for feedback feature
  chat: messageReducer,
  user: userReducer,
});

export default rootReducer;
