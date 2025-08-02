import { createSlice } from '@reduxjs/toolkit';
import {
  fetchAllStudents,
  fetchAllSupervisors,
  fetchUserById,
  updateUserRole,
  createSupervisor,
  assignSupervisorToStudent,
  fetchMyStudents,
} from './userThunks';

const initialState = {
  students: [],           // For Admin: all students
  assignedStudents: [],   // For Supervisor: students assigned to them
  supervisors: [],
  selectedUser: null,
  status: 'idle',
  error: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearSelectedUser: (state) => {
      state.selectedUser = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllStudents.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchAllStudents.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.students = action.payload;
      })
      .addCase(fetchAllStudents.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })

      .addCase(fetchAllSupervisors.fulfilled, (state, action) => {
        state.supervisors = action.payload;
        state.status = 'succeeded';
      })

      .addCase(fetchUserById.fulfilled, (state, action) => {
        state.selectedUser = action.payload;
      })

      .addCase(updateUserRole.fulfilled, (state, action) => {
        const updated = action.payload;
        const list = updated.role.toLowerCase() === 'student' ? state.students : state.supervisors;
        const index = list.findIndex((u) => u._id === updated._id);
        if (index !== -1) {
          list[index] = updated;
        }
      })

      .addCase(createSupervisor.fulfilled, (state, action) => {
        state.supervisors.push(action.payload);
      })

      .addCase(fetchMyStudents.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchMyStudents.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.assignedStudents = action.payload; // ✅ separated field
      })
      .addCase(fetchMyStudents.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })

      .addCase(assignSupervisorToStudent.fulfilled, (state, action) => {
        const updatedStudent = action.payload.student;
        const index = state.students.findIndex((u) => u._id === updatedStudent._id);
        if (index !== -1) {
          state.students[index] = updatedStudent;
        }
      });
  },
});

export const { clearSelectedUser } = userSlice.actions;
export default userSlice.reducer;
