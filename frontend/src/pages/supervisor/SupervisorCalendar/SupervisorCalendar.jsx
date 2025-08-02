// src/pages/supervisor/SupervisorCalendar.jsx
import React, { useEffect, useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './SupervisorCalendar.css';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { fetchEvents, createEvent } from '../../../features/calendar/calendarThunks';
import {
  selectCalendarEvents,
  selectCalendarLoading,
  selectCalendarError,
} from '../../../features/calendar/calendarSlice';

const SupervisorCalendar = () => {
  const dispatch = useDispatch();
  const { studentId } = useParams(); // ✅ Get studentId from URL

  const events = useSelector(selectCalendarEvents);
  const loading = useSelector(selectCalendarLoading);
  const error = useSelector(selectCalendarError);

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedEvents, setSelectedEvents] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'deadline',
  });

  useEffect(() => {
    if (studentId) {
      dispatch(fetchEvents(studentId)); // ✅ Fetch using studentId
    }
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

  const handleDateClick = (date) => {
    setSelectedDate(date);
    const dateStr = date.toISOString().split('T')[0];
    const matchedEvents = events.filter((e) => e.date.startsWith(dateStr));
    setSelectedEvents(matchedEvents);
    setShowForm(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!studentId) {
      alert('Student ID not found. Cannot add event.');
      return;
    }

    const eventPayload = {
      ...formData,
      date: selectedDate.toISOString(),
      studentId, // ✅ pass studentId not projectId
    };

    dispatch(createEvent(eventPayload));
    setFormData({ title: '', description: '', type: 'deadline' });
    setShowForm(false);
  };

  return (
    <div className="calendar-container">
      <h2>📅 Supervisor Calendar</h2>

      {loading && <p>Loading events...</p>}
      {error && <p className="error">{error}</p>}
      {!studentId && <p className="error">⚠️ No student selected.</p>}

      <Calendar
        onChange={setSelectedDate}
        value={selectedDate}
        onClickDay={handleDateClick}
        tileClassName={tileClassName}
      />

      {selectedEvents.length > 0 && (
        <div className="event-details">
          <h3>Events on {selectedDate.toDateString()}</h3>
          <ul>
            {selectedEvents.map((event, idx) => (
              <li key={idx}>
                <strong>{event.title}</strong> ({event.type})<br />
                <span>{event.description}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {showForm && (
        <div className="event-form">
          <h3>Add Event on {selectedDate.toDateString()}</h3>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Event title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
            <textarea
              placeholder="Description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            >
              <option value="deadline">Deadline</option>
              <option value="meeting">Meeting</option>
              <option value="milestone">Milestone</option>
            </select>
            <button type="submit">Add Event</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default SupervisorCalendar;
