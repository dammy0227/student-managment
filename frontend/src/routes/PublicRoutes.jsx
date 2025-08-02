import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';
import { selectAuth } from '../features/auth/authSlice';

const PublicRoute = () => {
  const { user, token } = useSelector(selectAuth);

  // If already logged in, redirect to role-based dashboard
  if (token && user) {
    switch (user.role.toLowerCase()) {
      case 'student':
        return <Navigate to="/student/dashboard" replace />;
      case 'supervisor':
        return <Navigate to="/supervisor/dashboard" replace />;
      case 'admin':
        return <Navigate to="/admin/dashboard" replace />;
      default:
        return <Navigate to="/" replace />;
    }
  }

  return <Outlet />;
};

export default PublicRoute;
