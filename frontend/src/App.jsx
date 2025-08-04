import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux'; // ✅ IMPORT useSelector
import './App.css';

import StudentRoutes from './routes/StudentRoutes';
import SupervisorRoutes from './routes/SupervisorRoutes';
import AdminRoutes from './routes/AdminRoutes';

import LoginPage from './pages/auth/Login/Login';
import RegisterPage from './pages/auth/Register/Register';

// import NotFound from './pages/common/NotFound';

const App = () => {
  const role = useSelector((state) => state.auth?.user?.role); // ✅ MOVE inside component

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />


        {/* Conditionally load routes based on role */}
        {role === 'Student' && <Route path="/*" element={<StudentRoutes />} />}
        {role === 'admin' && <Route path="/*" element={<AdminRoutes />} />}
        {role === 'Supervisor' && <Route path="/*" element={<SupervisorRoutes />} />}
      </Routes>
    </Router>
  );
};

export default App;
