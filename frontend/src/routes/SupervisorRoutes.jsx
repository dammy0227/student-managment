import { Routes, Route } from 'react-router-dom';
import RequireAuth from './RequireAuth';
import SupervisorLayout from '../layout/SupervisorLayout';

import SupervisorDashboard from '../pages/supervisor/SupervisorDashboard/SupervisorDashboard';
import ViewStudentProject from '../pages/supervisor/ViewStudentProject/ViewStudentProject';
import SupervisorProjectFiles from '../pages/supervisor/SupervisorProjectFiles/SupervisorProjectFiles';
import SupervisorFeedback from '../pages/supervisor/SupervisorFeedback/SupervisorFeedback';
import SupervisorChat from '../pages/supervisor/SupervisorChat/SupervisorChat.';
import SupervisorCalendar from '../pages/supervisor/SupervisorCalendar/SupervisorCalendar';
import SupervisorNotification from '../pages/supervisor/SupervisorNotification/SupervisorNotification';

const SupervisorRoutes = () => {
  return (
    <Routes>
      <Route element={<RequireAuth allowedRoles={['supervisor']} />}>
        <Route path="/supervisor" element={<SupervisorLayout />}>
          <Route path="dashboard" element={<SupervisorDashboard />} />
          <Route path="view-project" element={<ViewStudentProject />} />
          <Route path="project-file" element={<SupervisorProjectFiles />} />

          <Route path="student/:studentId/feedback" element={<SupervisorFeedback />} />
          <Route path="student/:studentId/chat" element={<SupervisorChat />} />
          <Route path="student/:studentId/calendar" element={<SupervisorCalendar />} />
          <Route path="notification" element={<SupervisorNotification />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default SupervisorRoutes;
