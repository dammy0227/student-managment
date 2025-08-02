import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../../../features/auth/authThunks';
import { useNavigate, Link } from 'react-router-dom';
import LoadingSpinner from '../../../components/shared/LoadingSpinner/LoadingSpinner';
import '../auth.css'; // Import the CSS

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, error } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const resultAction = await dispatch(loginUser(formData));

    if (loginUser.fulfilled.match(resultAction)) {
      const role = resultAction.payload?.user?.role?.toLowerCase();
      if (role) {
        navigate(`/${role}/dashboard`);
      } else {
        console.error('No user role found in payload:', resultAction.payload);
      }
    }
  };

  return (
    <div className="auth-page-wrapper">
       <div className="auth-form-container">
      <h2>Login</h2>
      {isLoading && <LoadingSpinner />}
      {error && <p className="error">{error}</p>}

      <form onSubmit={handleSubmit}>
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
          {isLoading ? 'Logging in...' : 'Login'}
        </button>
      </form>

      <p className="switch-link">
        Don't have an account? <Link to="/register">Register here</Link>
      </p>
    </div>
    </div>
   
  );
};

export default Login;
