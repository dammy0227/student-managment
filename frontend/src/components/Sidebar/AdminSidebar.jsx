import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../../features/auth/authSlice';
import './adminside.css';
import {
  Dashboard,
  PersonAdd,
  AssignmentInd,
  ExitToApp,
  ChevronLeft,
  ChevronRight
} from '@mui/icons-material';

const AdminSidebar = ({ onLinkClick, isCollapsed, onToggle }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleClick = () => {
    if (onLinkClick) onLinkClick();
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
    if (onLinkClick) onLinkClick();
  };

  return (
    <div className={`admin-sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        {!isCollapsed && (
          <div className="logo-container">
            <div className="logo-icon">A</div>
            <div className="logo-text">
              <h3>Admin Panel</h3>
              <span className="version">v2.0</span>
            </div>
          </div>
        )}
        <button className="collapse-btn" onClick={onToggle}>
          {isCollapsed ? <ChevronRight /> : <ChevronLeft />}
        </button>
      </div>

      <div className="sidebar-content">
        <ul className="nav-menu">
          <li>
            <NavLink 
              to="/admin/dashboard" 
              onClick={handleClick}
              className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
            >
              <Dashboard className="nav-icon" />
              {!isCollapsed && <span className="nav-text">Dashboard</span>}
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/admin/create-supervisor" 
              onClick={handleClick}
              className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
            >
              <PersonAdd className="nav-icon" />
              {!isCollapsed && <span className="nav-text">Create Supervisor</span>}
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/admin/assign-supervisor" 
              onClick={handleClick}
              className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
            >
              <AssignmentInd className="nav-icon" />
              {!isCollapsed && <span className="nav-text">Assign Supervisor</span>}
            </NavLink>
          </li>
        </ul>

        <div className="sidebar-footer">
          <div className="user-info">
            {!isCollapsed && (
              <>
                <div className="user-avatar">
                  <span>AD</span>
                </div>
                <div className="user-details">
                  <p className="user-name">Admin User</p>
                  <p className="user-role">Administrator</p>
                </div>
              </>
            )}
          </div>
          <button onClick={handleLogout} className="logout-btn">
            <ExitToApp className="logout-icon" />
            {!isCollapsed && <span>Log Out</span>}
          </button>
        </div>
      </div>
    </div>
  );
}; 

export default AdminSidebar;