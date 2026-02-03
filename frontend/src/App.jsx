import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import './App.css';

import "@fontsource/poppins";
import "@fontsource/poppins/400.css";
import "@fontsource/poppins/600.css";


import StudentRoutes from './routes/StudentRoutes';
import SupervisorRoutes from './routes/SupervisorRoutes';
import AdminRoutes from './routes/AdminRoutes';

import LoginPage from './pages/auth/Login/Login';
import RegisterPage from './pages/auth/Register/Register';

import { getSocket, disconnectSocket } from './socket'; 

const App = () => {
  const role = useSelector((state) => state.auth?.user?.role);

  useEffect(() => {
    const socket = getSocket(); 

    socket.on('connect', () => {
      console.log('🟢 Socket connected:', socket.id);
    });

    return () => {
      disconnectSocket(); 
      console.log('🔴 Socket disconnected');
    };
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Role-based routes */}
        {role === 'Student' && <Route path="/*" element={<StudentRoutes />} />}
        {role === 'admin' && <Route path="/*" element={<AdminRoutes />} />}
        {role === 'Supervisor' && <Route path="/*" element={<SupervisorRoutes />} />}
      </Routes>
    </Router>
  );
};

export default App;
