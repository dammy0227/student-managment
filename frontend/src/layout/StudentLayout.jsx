import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import StudentSidebar from '../components/Sidebar/StudentSidebar';
import './Layout.css';
import image from '../assets/nacos.png'

const StudentLayout = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleCloseMenu = () => setMenuOpen(false);

  return (
    <div className="layout-wrapper">
      {/* Top nav (only visible on mobile) */}
      <nav className="top-navbar">
        <button className="menu-toggle" onClick={() => setMenuOpen(true)}>☰</button>
          <img src={image} alt=""  className='logo'/>
      </nav>

      {/* Sidebar for large screens */}
      <div className="sidebar desktop-only">
        <StudentSidebar />
      </div>

      {/* Mobile sidebar overlay */}
      {menuOpen && (
        <div className="mobile-sidebar-overlay">
          <div className="mobile-sidebar">
            <button className="close-icon" onClick={handleCloseMenu}>✕</button>
            <StudentSidebar onLinkClick={handleCloseMenu} />
          </div>
        </div>
      )}

      <div className="main-content">
        <Outlet />
      </div>
    </div>
  );
};

export default StudentLayout;
