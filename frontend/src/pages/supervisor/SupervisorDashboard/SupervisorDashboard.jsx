import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getUserProfile } from '../../../features/auth/authThunks';
import { fetchFeedback } from '../../../features/feedback/feedbackThunks';
import { fetchMyStudents } from '../../../features/user/userThunks';
import { useNavigate } from 'react-router-dom';
import './SupervisorDashboard.css';

const SupervisorDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.auth);
  const { assignedStudents, status } = useSelector((state) => state.user);
  const [feedbackScores, setFeedbackScores] = useState({});
  const [selectedStudent, setSelectedStudent] = useState(null);

  useEffect(() => {
    dispatch(getUserProfile()).catch((err) =>
      console.error('❌ Failed to load profile:', err)
    );
  }, [dispatch]);

  useEffect(() => {
    if (user?.role === 'Supervisor') {
      dispatch(fetchMyStudents()).catch((err) =>
        console.error('❌ Failed to fetch students:', err)
      );
    }
  }, [dispatch, user]);

  useEffect(() => {
    assignedStudents.forEach((student) => {
      dispatch(fetchFeedback(student._id)).then((result) => {
        if (fetchFeedback.fulfilled.match(result)) {
          const feedbacks = result.payload;
          const totalScore = feedbacks.reduce((sum, fb) => sum + (fb.score || 0), 0);
          setFeedbackScores((prev) => ({
            ...prev,
            [student._id]: totalScore,
          }));
        }
      });
    });
  }, [assignedStudents, dispatch]);

  const handleStudentClick = (studentId) => {
    setSelectedStudent(studentId);
  };

  const handleAction = (action) => {
    navigate(`/supervisor/student/${selectedStudent}/${action}`);
    setSelectedStudent(null);
  };

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-heading">Welcome, {user?.fullName || 'Supervisor'} 👋</h1>

      {status === 'loading' ? (
        <p>Loading students...</p>
      ) : assignedStudents.length > 0 ? (
        <>
          <p className="dashboard-description">These students have been assigned to you:</p>
          <ul className="student-list">
            {assignedStudents.map((student) => (
              <li
                key={student._id}
                onClick={() => handleStudentClick(student._id)}
                className="student-card"
              >
                <div>
                  <div className="student-name">{student.fullName}</div>
                  <div className="student-info">
                    Matric No: {student.matricNumber || 'N/A'}
                  </div>
                </div>
                <div className="student-score">
                  Total Score: {feedbackScores[student._id] || 0}/100
                </div>
              </li>
            ))}
          </ul>
        </>
      ) : (
        <p style={{ color: 'gray' }}>No students have been assigned to you yet.</p>
      )}

      {/* Modal Popup */}
      {selectedStudent && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Select an Action</h3>
            <div className="btn-select">
              <button onClick={() => handleAction('feedback')}>📩 Send Feedback</button>
              <button onClick={() => handleAction('chat')}>💬 Start Chat</button>
              <button onClick={() => handleAction('calendar')}>📅 Set Calendar</button>
            </div>
            <button className="close-modal-icon" onClick={() => setSelectedStudent(null)}>✕</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SupervisorDashboard;
