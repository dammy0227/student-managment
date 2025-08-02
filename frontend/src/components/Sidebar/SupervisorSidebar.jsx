import React, { useEffect } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import {
  fetchNotifications,
  markAllAsRead,
} from '../../features/notification/notificationThunks';
import { selectUnreadCount } from '../../features/notification/notificationSlice';

import { fetchUnreadMessages } from '../../features/message/messageThunks';
import { selectUnreadMessagesCount } from '../../features/message/messageSlice';

import { fetchUnreadFileCount } from '../../features/file/fileThunks';
import { selectUnreadFileCount } from '../../features/file/fileSlice';

import { fetchUnreadProjectCount } from '../../features/project/projectThunks';
import { selectUnreadProjectCount } from '../../features/project/projectSlice';

import { logout } from '../../features/auth/authSlice';

import io from 'socket.io-client';
import './Sidebar.css';

const socket = io('http://localhost:5000');

const SupervisorSidebar = ({ onLinkClick }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const currentUser = useSelector((state) => state.auth.user);
  const unreadNotificationCount = useSelector(selectUnreadCount);
  const unreadFileCount = useSelector(selectUnreadFileCount);
  const unreadProjectCount = useSelector(selectUnreadProjectCount);
  const unreadMessages = useSelector((state) =>
    selectUnreadMessagesCount(state, currentUser?._id)
  );

  useEffect(() => {
    if (currentUser?._id) {
      socket.emit('joinRoom', currentUser._id);
    }

    dispatch(fetchNotifications());
    dispatch(fetchUnreadMessages());
    dispatch(fetchUnreadFileCount());
    dispatch(fetchUnreadProjectCount());

    if (location.pathname.includes('/notification')) {
      dispatch(markAllAsRead());
    }

    socket.on('newMessage', () => dispatch(fetchUnreadMessages()));
    socket.on('newNotification', () => dispatch(fetchNotifications()));
    socket.on('newFileUpload', () => dispatch(fetchUnreadFileCount()));
    socket.on('projectSubmitted', () => dispatch(fetchUnreadProjectCount()));

    return () => {
      socket.off('newMessage');
      socket.off('newNotification');
      socket.off('newFileUpload');
      socket.off('projectSubmitted');
    };
  }, [dispatch, currentUser, location.pathname]);

  const handleClick = () => {
    if (onLinkClick) onLinkClick(); // Close sidebar if passed
  };

  const handleProtectedClick = (e, routeType) => {
    e.preventDefault();
    alert(`⚠️ Please select a student from the dashboard to ${routeType}.`);
    if (onLinkClick) onLinkClick(); // Close sidebar
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
    if (onLinkClick) onLinkClick(); // Optional: close sidebar after logout
  };

  return (
    <div className="sidebar-inner">
      <ul>
        <li>
          <NavLink to="/supervisor/dashboard" onClick={handleClick}>
            Dashboard
          </NavLink>
        </li>

        <li>
          <NavLink to="/supervisor/view-project" onClick={handleClick}>
            View Proposal{' '}
            {unreadProjectCount > 0 && (
              <span className="badge">{unreadProjectCount}</span>
            )}
          </NavLink>
        </li>

        <li>
          <NavLink to="/supervisor/project-file" onClick={handleClick}>
            View Project File{' '}
            {unreadFileCount > 0 && (
              <span className="badge">{unreadFileCount}</span>
            )}
          </NavLink>
        </li>

        <li>
          <a href="#" onClick={(e) => handleProtectedClick(e, 'send feedback')}>
            Feedback
          </a>
        </li>

        <li>
          <a href="#" onClick={(e) => handleProtectedClick(e, 'chat with a student')}>
            Chat{' '}
            {unreadMessages > 0 && (
              <span className="badge">{unreadMessages}</span>
            )}
          </a>
        </li>

        <li>
          <a href="#" onClick={(e) => handleProtectedClick(e, 'set calendar')}>
            Calendar
          </a>
        </li>

        <li>
          <NavLink to="/supervisor/notification" onClick={handleClick}>
            Notification{' '}
            {unreadNotificationCount > 0 && (
              <span className="badge">{unreadNotificationCount}</span>
            )}
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

export default SupervisorSidebar;
