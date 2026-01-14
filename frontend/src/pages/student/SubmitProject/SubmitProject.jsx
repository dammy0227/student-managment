import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { submitProject, fetchMyProjects } from '../../../features/project/projectThunks';
import { getUserProfile } from '../../../features/auth/authThunks';
import LoadingSpinner from '../../../components/shared/LoadingSpinner/LoadingSpinner';
import './SubmitProject.css';
import io from 'socket.io-client';

const socket = io(); 

const SubmitProject = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { loading, projects } = useSelector((state) => state.project);

  const [formData, setFormData] = useState({ title: '', description: '' });
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (!user) dispatch(getUserProfile());
    dispatch(fetchMyProjects());
  }, [user, dispatch]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user?.supervisorId) {
      setSuccessMessage('❌ You cannot submit a project without an assigned supervisor');
      return setTimeout(() => setSuccessMessage(''), 5000);
    }

    if (projects.length >= 3) {
      setSuccessMessage('❌ You have reached the maximum limit of 3 project submissions');
      return setTimeout(() => setSuccessMessage(''), 5000);
    }

    const result = await dispatch(submitProject(formData));

    if (submitProject.fulfilled.match(result)) {
      setSuccessMessage('✅ Proposal submitted successfully');
      setFormData({ title: '', description: '' });
      dispatch(fetchMyProjects());


      socket.emit('projectSubmitted', {
        supervisorId: user.supervisorId,
        studentName: user.fullName,
        studentId: user._id,
      });
    } else {
      setSuccessMessage('❌ Submission failed: ' + (result.payload || 'Please try again.'));
    }

    setTimeout(() => setSuccessMessage(''), 5000);
  };

  return (
    <div className="submit-container">
      <h2>Submit Project Proposal</h2>

      {successMessage && <div className="success-message">{successMessage}</div>}
      <p><strong>Submitted:</strong> {projects.length} of 3 allowed</p>

      {projects.length >= 3 ? (
        <div className="limit-message">
          <p style={{ color: 'red' }}>❌ You have reached your submission limit.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="form-card">
          <div className="form-group">
            <label>Title</label>
            <input
              type="text"
              name="title"
              required
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter project title"
            />
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              required
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter brief description"
              rows={5}
            />
          </div>
          <button type="submit" disabled={loading}>
            {loading ? <LoadingSpinner /> : 'Submit Proposal'}
          </button>
        </form>
      )}
    </div>
  );
};

export default SubmitProject;
