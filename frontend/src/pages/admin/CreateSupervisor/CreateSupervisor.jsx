import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createSupervisor } from '../../../features/user/userThunks';
import './CreateSupervisor.css';

const CreateSupervisor = () => {
  const dispatch = useDispatch();
  const { status, error } = useSelector((state) => state.user);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
  });

  const [successMsg, setSuccessMsg] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const resultAction = await dispatch(createSupervisor(formData));

    if (createSupervisor.fulfilled.match(resultAction)) {
      setSuccessMsg('✅ Supervisor registered successfully!');
      setFormData({
        fullName: '',
        email: '',
        password: '',
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

      {status === 'loading' && <p>Creating supervisor...</p>}
      {successMsg && <p style={{ color: 'green' }}>{successMsg}</p>}
      {status === 'failed' && <p style={{ color: 'red' }}>{error}</p>}

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="fullName"
          placeholder="Full Name"
          value={formData.fullName}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        
        <button type="submit">Create Supervisor</button>
      </form>
    </div>
  ); 
};

export default CreateSupervisor;
