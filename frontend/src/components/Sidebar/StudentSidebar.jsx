import React, { useEffect } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchNotifications,
  markAllAsRead,
} from '../../features/notification/notificationThunks';
import { selectUnreadCount } from '../../features/notification/notificationSlice';
import { fetchUnreadMessages } from '../../features/message/messageThunks';
import { selectUnreadMessagesCount } from '../../features/message/messageSlice';
import { fetchUnreadFeedbackCount } from '../../features/feedback/feedbackThunks';
// import { selectUnreadFeedbackCount } from '../../features/feedback/feedbackSlice';
import { fetchUnreadCalendarCount } from '../../features/calendar/calendarThunks';
import { selectUnreadCalendarCount } from '../../features/calendar/calendarSlice';
import { logout } from '../../features/auth/authSlice';
import io from 'socket.io-client';
import './side.css';

const socket = io('http://localhost:5000');

const StudentSidebar = ({ onLinkClick }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const currentUser = useSelector((state) => state.auth.user);
  const unreadCount = useSelector(selectUnreadCount);
  // const unreadFeedbackCount = useSelector(selectUnreadFeedbackCount);
  const unreadCalendarCount = useSelector(selectUnreadCalendarCount);
  const unreadMessages = useSelector((state) =>
    selectUnreadMessagesCount(state, currentUser?._id)
  );

  useEffect(() => {
    if (currentUser?._id) {
      socket.emit('joinRoom', currentUser._id);
    }

    dispatch(fetchUnreadMessages());
    dispatch(fetchUnreadFeedbackCount());
    dispatch(fetchNotifications());

    if (currentUser?._id) {
      dispatch(fetchUnreadCalendarCount(currentUser._id));
    }

    if (location.pathname === '/student/notifications') {
      dispatch(markAllAsRead());
    }

    socket.on('newMessage', () => dispatch(fetchUnreadMessages()));
    socket.on('newFeedback', () => dispatch(fetchUnreadFeedbackCount()));
    socket.on('newNotification', () => dispatch(fetchNotifications()));
    socket.on('newCalendarEntry', () =>
      dispatch(fetchUnreadCalendarCount(currentUser._id))
    );

    return () => {
      socket.off('newMessage');
      socket.off('newFeedback');
      socket.off('newNotification');
      socket.off('newCalendarEntry');
    };
  }, [dispatch, currentUser, location.pathname]);

  const handleProtectedClick = (e, path) => {
    if (!currentUser?.supervisorId) {
      e.preventDefault();
      alert('⚠️ You have not been assigned to a supervisor yet.');
    } else {
      if (onLinkClick) onLinkClick();
      navigate(path);
    }
  };

  const handleUnprotectedClick = (e, path) => {
    if (onLinkClick) onLinkClick();
    navigate(path);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <div className="sidebar-inner">
      <ul>
        <li>
          <a href="#" onClick={(e) => handleUnprotectedClick(e, '/student/dashboard')}>
            Dashboard
          </a>
        </li>
        <li>
          <a href="#" onClick={(e) => handleProtectedClick(e, '/student/submitproject')}>
            Submit Proposal
          </a>
        </li>
        <li>
          <a href="#" onClick={(e) => handleProtectedClick(e, '/student/view-project')}>
            View Proposal
          </a>
        </li>
        <li>
          <a
  href="#"
  onClick={(e) => {
    e.preventDefault();
    if (!currentUser?.projectId) {
      alert('⚠️ Please submit or select a proposal first.');
    } else {
      handleProtectedClick(e, `/student/project/${currentUser.projectId}/files`);
    }
  }}
>
  Submit Project Pdf
</a>

        </li>
        <li>
          <a href="#" onClick={(e) => handleProtectedClick(e, '/student/feedback')}>
            Feedback{' '}
            {/* {unreadFeedbackCount > 0 && (
              <span className="badge">{unreadFeedbackCount}</span>
            )} */}
          </a>
        </li>
        <li>
          <a href="#" onClick={(e) => handleProtectedClick(e, '/student/chat')}>
            Chat{' '}
            {unreadMessages > 0 && (
              <span className="badge">{unreadMessages}</span>
            )}
          </a>
        </li>
        <li>
          <a href="#" onClick={(e) => handleProtectedClick(e, '/student/calendar')}>
            Calendar{' '}
            {unreadCalendarCount > 0 && (
              <span className="badge">{unreadCalendarCount}</span>
            )}
          </a>
        </li>
        <li>
          <a href="#" onClick={(e) => handleUnprotectedClick(e, '/student/notifications')}>
            Notifications{' '}
            {unreadCount > 0 && <span className="badge">{unreadCount}</span>}
          </a>
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

export default StudentSidebar;
