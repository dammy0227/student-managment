// services/endpoints.js

export const AUTH = {
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  PROFILE: '/auth/profile',
};

export const PROJECTS = {
  SUBMIT: '/projects',
  MINE: '/projects/my',
  SINGLE: (id) => `/projects/${id}`,
  ALL: '/projects',
  STATUS: (id) => `/projects/${id}/status`,
  ASSIGN_SUPERVISOR: (id) => `/projects/${id}/assign-supervisor`,
  UNREAD_COUNT: '/projects/supervised/unread-count',       // 👈 Add this
  MARK_AS_READ: '/projects/supervised/mark-read',          // 👈 And this
};


export const TASKS = {
  CREATE: '/tasks',
  BY_PROJECT: (projectId) => `/tasks/${projectId}`,
  UPDATE_STATUS: (id) => `/tasks/${id}/status`,
};


export const USERS = {
  STUDENTS: '/users/students',
  SUPERVISORS: '/users/supervisors',
  BY_ID: (id) => `/users/${id}`,
  UPDATE_ROLE: (id) => `/users/${id}/role`,
  CREATE_SUPERVISOR: '/users/create-supervisor',
  // ✅ New: assign a supervisor to a student
 ASSIGN_SUPERVISOR_TO_STUDENT: (studentId) => `/users/${studentId}/assign-supervisor`,
};


export const FEEDBACK = {
  SEND: '/feedback/send',
  VIEW_BY_STUDENT: (studentId) => `/feedback/student/${studentId}`,
  UPDATE: (feedbackId) => `/feedback/${feedbackId}`,  // PUT
  DELETE: (feedbackId) => `/feedback/${feedbackId}`,  // DELETE
   UNREAD_COUNT: '/feedback/unread-count',                // NEW ✅
  MARK_AS_READ: '/feedback/mark-read',  
};


export const FILES = {
  UPLOAD: '/files/upload',
 BY_PROJECT: (projectId) => `/files/${projectId}`,
  FOR_SUPERVISOR: '/files/assigned-to-me',
  UPDATE_STATUS: (documentId) => `/files/status/${documentId}`,
  UNREAD_COUNT: '/files/assigned-to-me/unread-count',
  MARK_AS_READ: '/files/assigned-to-me/mark-read',
};


export const MESSAGES = {
  SEND: '/messages',
  GET: (userId) => `/messages/${userId}`,
  MARK_AS_READ: '/messages/read',
  UNREAD_ALL: '/messages/unread/all', // ✅ Add this line
};

export const NOTIFICATIONS = {
  LIST: '/notifications',
  MARK_ALL_AS_READ: '/notifications/read-all',
  BY_STUDENT: (studentId) => `/notifications/student/${studentId}`,
};

export const CALENDAR = {
  ADD: '/calendar/student', // POST
  GET_BY_STUDENT: (studentId) => `/calendar/student/${studentId}`, // GET
  UNREAD_COUNT: (studentId) => `/calendar/student/${studentId}/unread-count`, // GET
  MARK_AS_READ: (studentId) => `/calendar/student/${studentId}/mark-read`, // PUT
};
