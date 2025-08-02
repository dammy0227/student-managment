import React, { useEffect, useState } from 'react';
import { FaBell } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { fetchNotifications } from '../../../features/notification/notificationThunks';
import {
  selectNotifications,
  selectNotificationLoading,
  selectNotificationError,
} from '../../../features/notification/notificationSlice';
import './NotificationBell.css';

const NotificationBell = () => {
  const dispatch = useDispatch();
  const [showDropdown, setShowDropdown] = useState(false);

  const notifications = useSelector(selectNotifications);
  const loading = useSelector(selectNotificationLoading);
  const error = useSelector(selectNotificationError);

  useEffect(() => {
    dispatch(fetchNotifications());
  }, [dispatch]);

  return (
    <div className="notification-bell">
      <FaBell onClick={() => setShowDropdown(!showDropdown)} />
      {notifications.length > 0 && <span className="badge">{notifications.length}</span>}
      {showDropdown && (
        <div className="dropdown">
          {loading && <p>Loading...</p>}
          {error && <p className="error">{error}</p>}
          {!loading && !error && notifications.length > 0 ? (
            notifications.map((n) => (
              <div key={n._id} className="notif-item">
                {n.message}
              </div>
            ))
          ) : (
            <p>No notifications</p>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
