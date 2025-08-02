import React from 'react';
import { Link } from 'react-router-dom';
import NotificationBell from '../shared/NotificationBell/NotificationBell';
import './MainNavbar.css';

const MainNavbar = () => {
  return (
    <nav className="">
      <div className="logo">
        <Link to="/">🎓 Student Portal</Link>
      </div>
      <div className="nav-links">
        <NotificationBell />     <Link to="/logout">Logout</Link>
      </div>
    </nav>
  );
};

export default MainNavbar;
