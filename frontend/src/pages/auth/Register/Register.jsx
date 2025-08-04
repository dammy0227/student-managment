import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser } from '../../../features/auth/authThunks';
import { useNavigate, Link } from 'react-router-dom';
import LoadingSpinner from '../../../components/shared/LoadingSpinner/LoadingSpinner';
import '../auth.css';

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, error } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    fullName: '',
    matricNumber: '',
    email: '',
    password: '',
    role: 'Student',
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(registerUser(formData));
    if (registerUser.fulfilled.match(result)) {
      navigate('/login');
    }
  };

  return (
    <div className="auth-page-wrapper">
      <div className="auth-card">
        <div className="auth-form-container">
          <h2>Student Registration</h2>
          {isLoading && <LoadingSpinner />}
          {error && <p className="error">{error}</p>}

          <form onSubmit={handleSubmit}>
            <div>
              <label>Full Name:</label>
              <input
                name="fullName"
                type="text"
                value={formData.fullName}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label>Matric Number:</label>
              <input
                name="matricNumber"
                type="text"
                value={formData.matricNumber}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label>Email:</label>
              <input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label>Password:</label>
              <input
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <button type="submit" disabled={isLoading}>
              {isLoading ? 'Registering...' : 'Register'}
            </button>
          </form>

          <p className="form-link">
            Already have an account? <Link to="/login">Login here</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
