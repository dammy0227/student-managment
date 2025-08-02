import React from 'react';
import { Routes, Route } from 'react-router-dom';
import RequireAuth from './RequireAuth';
import StudentLayout from '../layout/StudentLayout';

import Dashboard from '../pages/student/Dashboard/Dashboard';
import SubmitProject from '../pages/student/SubmitProject/SubmitProject';
import ViewProject from '../pages/student/ViewProject/ViewProject';
import FileUpload from '../pages/student/File/File';
import StudentCalendar from '../pages/student/StudentCalendar/StudentCalendar';
import StudentNotification from '../pages/student/StudentNotification/StudentNotification';
import StudentFeedback from '../pages/student/StudentFeedback/StudentFeedback';
import StudentChat from '../pages/student/StudentChat/StudentChat';
// import ChatPage from '../pages/student/ChatPage';
// import FeedbackPage from '../pages/student/FeedbackPage';
// import CalendarPage from '../pages/student/CalendarPage';

const StudentRoutes = () => {
  return (
    <Routes>
      <Route
        element={<RequireAuth allowedRoles={['student']} />}
      >
        <Route path="/student" element={<StudentLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="submitproject" element={<SubmitProject />} />
          <Route path="view-project" element={<ViewProject />} />
          <Route path="upload-file" element={<FileUpload />} />
          {/* <Route path="/upload-file/:projectId" element={<File />} /> */}
          <Route path="upload-file/:projectId" element={<FileUpload />} />
          <Route path="calendar" element={<StudentCalendar />} /> 
          <Route path='notifications' element={<StudentNotification />} />
          <Route path='feedback' element={<StudentFeedback />} />
          <Route path="chat" element={<StudentChat />} />
          {/* <Route path="chat" element={<ChatPage />} />
          <Route path="feedback" element={<FeedbackPage />} />
          <Route path="calendar" element={<CalendarPage />} /> */}
        </Route>
      </Route>
    </Routes>
  );
};

export default StudentRoutes;
