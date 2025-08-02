import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  submitFeedback,
  fetchFeedback,
  updateFeedback,
  deleteFeedback,
} from '../../../features/feedback/feedbackThunks';
import {
  selectFeedback,
  selectFeedbackLoading,
  selectFeedbackError,
} from '../../../features/feedback/feedbackSlice';
import { useParams } from 'react-router-dom';
import './SupervisorFeedback.css'

const SupervisorFeedback = () => {
  const dispatch = useDispatch();
  const loading = useSelector(selectFeedbackLoading);
  const error = useSelector(selectFeedbackError);
  const feedbackList = useSelector(selectFeedback);

  const [chapter, setChapter] = useState('Chapter 1');
  const [comment, setComment] = useState('');
  const [score, setScore] = useState(0); // ✅ Add score state
  const [successMessage, setSuccessMessage] = useState('');
  const [editingId, setEditingId] = useState(null);

  const { studentId } = useParams();

  useEffect(() => {
    if (studentId) {
      dispatch(fetchFeedback(studentId));
    }
  }, [dispatch, studentId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return alert('Please enter feedback.');

    try {
      if (editingId) {
        await dispatch(
          updateFeedback({
            feedbackId: editingId,
            chapterTitle: chapter,
            comment,
            score,
          })
        ).unwrap();
        setSuccessMessage('✅ Feedback updated');
      } else {
        await dispatch(
          submitFeedback({
            studentId,
            chapterTitle: chapter,
            comment,
            score,
          })
        ).unwrap();
        setSuccessMessage('✅ Feedback sent successfully');
      }
      resetForm();
    } catch (error) {
      console.error('❌ Failed to send feedback:', error);
      setSuccessMessage('');
      alert('Failed to send feedback. Please try again.');
    }
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this feedback?')) {
      dispatch(deleteFeedback(id));
    }
  };

  const handleEdit = (feedback) => {
    setChapter(feedback.chapterTitle);
    setComment(feedback.comment);
    setScore(feedback.score || 0);
    setEditingId(feedback._id);
  };

  const resetForm = () => {
    setComment('');
    setChapter('Chapter 1');
    setScore(0);
    setEditingId(null);
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  return (
    <div className="feedback-wrapper">
      {/* Feedback Form */}
      <div className="feedback-form">
        <h2>{editingId ? 'Edit Feedback' : 'Send Feedback to Student'}</h2>
        <form onSubmit={handleSubmit} className='feedback-forms'>
          <div className='form-label'>
            <label htmlFor="chapter" className='chapter'>Chapter:</label>
            <select id="chapter" value={chapter} onChange={(e) => setChapter(e.target.value)}>
              <option value="Chapter 1">Chapter 1</option>
              <option value="Chapter 2">Chapter 2</option>
              <option value="Chapter 3">Chapter 3</option>
              <option value="Chapter 4">Chapter 4</option>
              <option value="Chapter 5">Chapter 5</option>
              <option value="General">General</option>
            </select>
          </div>

          <div className='comment'>
            <label htmlFor="comment">Feedback:</label>
            <textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows="5"
              required
              placeholder="Enter your feedback..."
            ></textarea>
          </div>

          <div className='score'>
            <label htmlFor="score">Score (0-20):</label>
            <input
              type="number"
              id="score"
              value={score}
              min={0}
              max={20}
              onChange={(e) => setScore(Number(e.target.value))}
              required
            />
          </div>

          <button type="submit" disabled={loading}>
            {editingId ? (loading ? 'Updating...' : 'Update Feedback') : loading ? 'Sending...' : 'Send Feedback'}
          </button>

          {successMessage && <p className="success">{successMessage}</p>}
          {error && <p className="error">❌ {error}</p>}
        </form>
      </div>



      {/* Feedback List */}
      <div className="feedback-historys">
        {feedbackList.length === 0 ? (
          <p>No feedback submitted yet.</p>
        ) : (
          feedbackList.map((item) => (
            <div
              key={item._id}
              className="feedback-card"
            >
              <p className='feedback-title'><strong className='feedback-title'>{item.chapterTitle}</strong></p>
              <p>{item.comment}</p>
              {item.score !== undefined && item.score !== null && (
                <p className='score'><strong>Score:</strong> {item.score}/20</p>
              )}
              <small>Sent on: {new Date(item.createdAt).toLocaleString()}</small>
              <div className='btn-flex'>
                <button onClick={() => handleEdit(item)} className='bb btn-green'>Edit</button>
                <button onClick={() => handleDelete(item._id)} className='bb btn-red'>Delete</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default SupervisorFeedback;
