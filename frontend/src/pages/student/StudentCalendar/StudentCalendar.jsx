import React, { useEffect, useState } from 'react';
import { getSocket } from '../../../socket'; 
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './StudentCalendar.css';
import { useDispatch, useSelector } from 'react-redux';
import { fetchEvents, markCalendarAsRead } from '../../../features/calendar/calendarThunks';
import {
  selectCalendarEvents,
  selectCalendarLoading,
  selectCalendarError,
} from '../../../features/calendar/calendarSlice';

const StudentCalendar = () => {
  const dispatch = useDispatch();
  const studentId = useSelector((state) => state.auth.user?._id);
  const events = useSelector(selectCalendarEvents);
  const loading = useSelector(selectCalendarLoading);
  const error = useSelector(selectCalendarError);

  const [value, setValue] = useState(new Date());
  const [selectedEvents, setSelectedEvents] = useState([]);


  useEffect(() => {
    if (!studentId) return;

    const socket = getSocket();

    socket.emit('joinRoom', studentId);
    dispatch(fetchEvents(studentId));
    dispatch(markCalendarAsRead(studentId));

    return () => {
      socket.emit('leaveRoom', studentId); 
    };
  }, [studentId, dispatch]);


  useEffect(() => {
    if (!studentId) return;

    const socket = getSocket();

    const handleNewEvent = () => {
      dispatch(fetchEvents(studentId));
    };

    socket.on('newCalendarEvent', handleNewEvent);

    return () => {
      socket.off('newCalendarEvent', handleNewEvent);
    };
  }, [studentId, dispatch]);

  const deadlineDates = new Set(
    events.map((event) => new Date(event.date).toISOString().split('T')[0])
  );

  const tileClassName = ({ date, view }) => {
    if (view === 'month') {
      const dateStr = date.toISOString().split('T')[0];
      if (deadlineDates.has(dateStr)) {
        return 'deadline-date';
      }
    }
    return null;
  };

  const onClickDay = (date) => {
    const dateStr = date.toISOString().split('T')[0];
    const matchedEvents = events.filter((e) => e.date.startsWith(dateStr));
    setSelectedEvents(matchedEvents);
  };

  return (
    <div className="calendar-container">
      <h2>📅 Student Calendar</h2>

      {loading && <p>Loading events...</p>}
      {error && <p className="error">{error}</p>}
      {!studentId && <p className="error">⚠️ No student found.</p>}

      <Calendar
        onChange={setValue}
        value={value}
        tileClassName={tileClassName}
        onClickDay={onClickDay}
      />

      {selectedEvents.length > 0 ? (
        <div className="event-details">
          <h3>Events on {value.toDateString()}</h3>
          <ul>
            {selectedEvents.map((event, idx) => (
              <li key={idx}>
                <strong>{event.title}</strong> ({event.type})<br />
                <span>{event.description}</span>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p>No events for {value.toDateString()}</p>
      )}
    </div>
  );
};

export default StudentCalendar;
