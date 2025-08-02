import React from 'react';
import { NavLink } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../../features/auth/authSlice';
import { useNavigate } from 'react-router-dom';
import './side.css';

const AdminSidebar = ({ onLinkClick }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleClick = () => {
    if (onLinkClick) onLinkClick(); // close sidebar
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
    if (onLinkClick) onLinkClick(); // close sidebar after logout
  };

  return (
    <div className="sidebar-inner">
      <ul>
        <li>
          <NavLink to="/admin/dashboard" onClick={handleClick}>
            Dashboard
          </NavLink>
        </li>
        <li>
          <NavLink to="/admin/create-supervisor" onClick={handleClick}>
            Create Supervisor
          </NavLink>
        </li>
        <li>
          <NavLink to="/admin/assign-supervisor" onClick={handleClick}>
            Assign Supervisor
          </NavLink>
        </li>
        <li>
          <button onClick={handleLogout} className="logout-link">
            Log out
          </button>
        </li>
      </ul>
    </div>
  );
};

export default AdminSidebar;
