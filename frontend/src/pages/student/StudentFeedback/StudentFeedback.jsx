import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchFeedback,
  markFeedbackAsRead,
} from '../../../features/feedback/feedbackThunks';
import { getSocket } from '../../../socket'; 
import {
  selectFeedback,
  selectFeedbackLoading,
} from '../../../features/feedback/feedbackSlice';
import './StudentFeedback.css';

const MAX_LENGTH = 5; 

const StudentFeedback = () => {
  const dispatch = useDispatch();
  const feedbackList = useSelector(selectFeedback);
  const loading = useSelector(selectFeedbackLoading);
  const { user } = useSelector((state) => state.auth);

  const [selectedFeedback, setSelectedFeedback] = useState(null); 

  useEffect(() => {
    if (!user?._id) return;

    const socket = getSocket();

    
    socket.emit('joinRoom', user._id);

    
    dispatch(fetchFeedback(user._id));
    dispatch(markFeedbackAsRead()).unwrap().catch(console.error);

    
    const handleNewFeedback = (feedbackData) => {
      alert(`📢 New Feedback: ${feedbackData.chapterTitle}`);
      dispatch(fetchFeedback(user._id));
    };

    socket.on('newFeedback', handleNewFeedback);

    
    return () => {
      socket.off('newFeedback', handleNewFeedback);
    };
  }, [dispatch, user]);

  const truncate = (text) =>
    text.length > MAX_LENGTH ? text.slice(0, MAX_LENGTH) + '...' : text;

  return (
    <div className="feedback-history">
      {loading && <p>Loading feedback...</p>}
      {feedbackList.length === 0 && !loading ? (
        <p>No feedback from your supervisor yet.</p>
      ) : (
        feedbackList.map((item) => (
          <div key={item._id} className="feedback-card">
            <p><strong>{item.chapterTitle}</strong></p>

            <p>
              {item.comment.length > MAX_LENGTH ? (
                <>
                  {truncate(item.comment)}{' '}
                  <button
                    className="read-more-btn"
                    onClick={() => setSelectedFeedback(item)}
                  >
                    Read more
                  </button>
                </>
              ) : (
                item.comment
              )}
            </p>

            {typeof item.score === 'number' && (
              <p className="feedback-score">
                <strong>Score:</strong> {item.score}/20
              </p>
            )}

            <small>
              Supervisor: {item.supervisor?.fullName || 'N/A'} ({item.supervisor?.email || 'N/A'})<br />
              Sent on: {new Date(item.createdAt).toLocaleString()}
            </small>
          </div>
        ))
      )}

      {/* Modal */}
      {selectedFeedback && (
        <div className="feedback-modal-overlay">
          <div className="feedback-modal">
            <button className="close-modal" onClick={() => setSelectedFeedback(null)}>×</button>
            <h3>{selectedFeedback.chapterTitle}</h3>
            <p>{selectedFeedback.comment}</p>
            <p><strong>Score:</strong> {selectedFeedback.score}/20</p>
            <small>
              Supervisor: {selectedFeedback.supervisor?.fullName || 'N/A'}<br />
              Sent on: {new Date(selectedFeedback.createdAt).toLocaleString()}
            </small>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentFeedback;
