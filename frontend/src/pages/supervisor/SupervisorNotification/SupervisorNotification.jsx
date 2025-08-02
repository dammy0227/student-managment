import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchNotifications,
} from '../../../features/notification/notificationThunks';
import {
  selectAllNotifications,
  selectNotificationLoading,
  selectNotificationError,
} from '../../../features/notification/notificationSlice';
import './SupervisorNotification.css'

const SupervisorNotification = () => {
  const dispatch = useDispatch();
  const notifications = useSelector(selectAllNotifications);
  const loading = useSelector(selectNotificationLoading);
  const error = useSelector(selectNotificationError);

  useEffect(() => {
    dispatch(fetchNotifications()); // ✅ Fetch notifications for current supervisor
  }, [dispatch]);

  if (loading) return <p>Loading notifications...</p>;
  if (error) return <p style={{ color: 'red' }}>Error: {error}</p>;

  return (
    <div className="supervisor-notification">
      <h2 style={{color : '#2e7d32'}}>🔔Notifications</h2>

      {notifications.length === 0 ? (
        <p>No notifications yet.</p>
      ) : (
        <ul>
          {notifications.map((note) => (
            <li
              key={note._id}
              style={{
                backgroundColor: note.isRead ? '#f0f0f0' : '#e0f7fa',
                padding: '10px',
                marginBottom: '8px',
                borderRadius: '6px',
              }}
            >
              <strong>{note.title || 'Notification'}</strong>
              <p>{note.message}</p>
              <small>{new Date(note.createdAt).toLocaleString()}</small>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SupervisorNotification;
