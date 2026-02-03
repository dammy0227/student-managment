import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createSupervisor } from '../../../features/user/userThunks';
import './CreateSupervisor.css';
import { FaUserTie, FaCheckCircle, FaExclamationTriangle, FaSpinner } from 'react-icons/fa';

const CreateSupervisor = () => {
  const dispatch = useDispatch();
  const { status, error } = useSelector((state) => state.user);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
  });

  const [successMsg, setSuccessMsg] = useState('');
  const [touched, setTouched] = useState({
    fullName: false,
    email: false,
    password: false,
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setTouched({ ...touched, [e.target.name]: true });
  };

  const handleBlur = (e) => {
    setTouched({ ...touched, [e.target.name]: true });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const resultAction = await dispatch(createSupervisor(formData));

    if (createSupervisor.fulfilled.match(resultAction)) {
      setSuccessMsg('Supervisor registered successfully!');
      setFormData({
        fullName: '',
        email: '',
        password: '',
      });
      setTouched({
        fullName: false,
        email: false,
        password: false,
      });
    }
  };

  useEffect(() => {
    if (status === 'failed') {
      setSuccessMsg('');
    }
  }, [status]);

  return (
    <div className="create-supervisor-container">
      <h2>Create New Supervisor</h2>
      <p className="create-supervisor-subtitle">
        <FaUserTie style={{ marginRight: '8px', verticalAlign: 'middle', color: '#059669' }} />
        Add a new supervisor to manage platform activities
      </p>

      {/* Status Messages */}
      <div className="status-container">
        {status === 'loading' && (
          <div className="loading-message">
            <div className="loading-spinner"></div>
            Creating supervisor account...
          </div>
        )}
        
        {successMsg && (
          <div className="success-message">
            <FaCheckCircle /> {successMsg}
          </div>
        )}
        
        {status === 'failed' && (
          <div className="error-message">
            <FaExclamationTriangle /> {error}
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className='admin-form'>
        <div className="form-group">
          <label className="form-label">Full Name</label>
          <input
            type="text"
            name="fullName"
            placeholder="Enter supervisor's full name"
            value={formData.fullName}
            onChange={handleChange}
            onBlur={handleBlur}
            required
            className={touched.fullName && !formData.fullName ? 'input-error' : ''}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Email Address</label>
          <input
            type="email"
            name="email"
            placeholder="supervisor@example.com"
            value={formData.email}
            onChange={handleChange}
            onBlur={handleBlur}
            required
            className={touched.email && !formData.email ? 'input-error' : ''}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Password</label>
          <input
            type="password"
            name="password"
            placeholder="Create a strong password"
            value={formData.password}
            onChange={handleChange}
            onBlur={handleBlur}
            required
            minLength="6"
            className={touched.password && !formData.password ? 'input-error' : ''}
          />
        </div>
        
        <button 
          type="submit"
          disabled={status === 'loading'}
        >
          {status === 'loading' ? (
            <>
              <FaSpinner className="spinner-icon" /> Creating...
            </>
          ) : (
            'Create Supervisor Account'
          )}
        </button>
      </form>
    </div>
  ); 
};

export default CreateSupervisor;