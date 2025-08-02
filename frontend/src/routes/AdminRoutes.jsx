import React from 'react';
import { Routes, Route } from 'react-router-dom';
import RequireAuth from './RequireAuth';
import AdminLayout from '../layout/AdminLayout';

// import Dashboard from '../pages/admin/Dashboard';
// import AssignSupervisor from '../pages/admin/AssignSupervisor';
// import CreateSupervisor from '../pages/admin/CreateSupervisor';
// import ViewProject from '../pages/admin/ViewProject';
import AdminDashboard from '../pages/admin/AdminDashboard/AdminDashboard';
import CreateSupervisor from '../pages/admin/CreateSupervisor/CreateSupervisor';
import AssignSupervisor from '../pages/admin/AssignSupervisor/AssignSupervisor';

const AdminRoutes = () => {
  return (
    <Routes>
      <Route
        element={<RequireAuth allowedRoles={['admin']} />}
      >
        <Route path="/admin" element={<AdminLayout />}>
            
              <Route path="dashboard" element={<AdminDashboard/>} />
              <Route path="create-supervisor" element={<CreateSupervisor/>} />
                <Route path="assign-supervisor" element={<AssignSupervisor/>} />

          {/* <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="assign-supervisor" element={<AssignSupervisor />} />
          <Route path="create-supervisor" element={<CreateSupervisor />} />
          <Route path="view-project" element={<ViewProject />} /> */}
        </Route>
      </Route>
    </Routes>
  );
};

export default AdminRoutes;
