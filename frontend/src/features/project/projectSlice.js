// src/features/project/projectSlice.js
import { createSlice } from '@reduxjs/toolkit';
import {
  submitProject,
  fetchMyProjects,
  fetchAllProjects,
  getSingleProject,
  assignSupervisorToProject,
  updateProjectStatus,
  fetchUnreadProjectCount,
  markProjectsAsRead,
  fetchProjectsByStudent,
} from './projectThunks';

const savedProject = localStorage.getItem('selectedProject');

const initialState = {
  projects: [],
  currentProject: savedProject ? JSON.parse(savedProject) : null,
  status: 'idle',
  error: null,
  unreadCount: 0,
  selectedStudentProjects: [],
  selectedStudent: null,
};

const projectSlice = createSlice({
  name: 'project',
  initialState,
  reducers: {
    clearProjectState: (state) => {
      state.currentProject = null;
      state.status = 'idle';
      state.error = null;
    },
    setCurrentProject: (state, action) => {
      state.currentProject = action.payload;
      if (!action.payload) {
        localStorage.removeItem('selectedProject');
      } else {
        localStorage.setItem('selectedProject', JSON.stringify(action.payload));
      }
    },
    setSelectedStudent: (state, action) => {
      state.selectedStudent = action.payload;
      state.selectedStudentProjects = [];
    },
    clearStudentProjects: (state) => {
      state.selectedStudent = null;
      state.selectedStudentProjects = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(submitProject.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(submitProject.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.projects.push(action.payload);
      })
      .addCase(submitProject.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })

      .addCase(fetchMyProjects.fulfilled, (state, action) => {
        state.projects = action.payload;
        state.status = 'succeeded';
      })

      .addCase(fetchAllProjects.fulfilled, (state, action) => {
        state.projects = action.payload;
        state.status = 'succeeded';
      })

      .addCase(getSingleProject.fulfilled, (state, action) => {
        state.currentProject = action.payload;
        state.status = 'succeeded';
      })

      .addCase(assignSupervisorToProject.fulfilled, (state, action) => {
        const idx = state.projects.findIndex((p) => p._id === action.payload._id);
        if (idx !== -1) state.projects[idx] = action.payload;
      })

      .addCase(updateProjectStatus.fulfilled, (state, action) => {
        const idx = state.projects.findIndex((p) => p._id === action.payload._id);
        if (idx !== -1) state.projects[idx] = action.payload;
      })

      .addCase(fetchUnreadProjectCount.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUnreadProjectCount.fulfilled, (state, action) => {
        state.loading = false;
        state.unreadCount = action.payload.count;
      })
      .addCase(fetchUnreadProjectCount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(markProjectsAsRead.fulfilled, (state) => {
        state.unreadCount = 0;
      })

      .addCase(fetchProjectsByStudent.fulfilled, (state, action) => {
        state.selectedStudentProjects = action.payload.projects;
        state.selectedStudent = action.payload.student;
      });
  },
});

// ✅ Actions
export const {
  clearProjectState,
  setCurrentProject,
  setSelectedStudent,
  clearStudentProjects,
} = projectSlice.actions;

// ✅ Selectors
export const selectCurrentProject = (state) => state.project.currentProject;
export const selectUnreadProjectCount = (state) => state.project.unreadCount;
export const selectSelectedStudent = (state) => state.project.selectedStudent;
export const selectSelectedStudentProjects = (state) => state.project.selectedStudentProjects;

// ✅ Reducer
export default projectSlice.reducer;
