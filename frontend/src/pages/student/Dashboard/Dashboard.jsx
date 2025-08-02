import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getUserProfile } from '../../../features/auth/authThunks';
import { fetchUserById } from '../../../features/user/userThunks';
import './Dashboard.css'

const Dashboard = () => {
  const dispatch = useDispatch();
  const { user, } = useSelector((state) => state.auth);
  const [supervisor, setSupervisor] = useState(null);

useEffect(() => {
  dispatch(getUserProfile());
}, [dispatch]);


  useEffect(() => {
    if (user?.supervisorId) {
      dispatch(fetchUserById(user.supervisorId))
        .unwrap()
        .then((supervisorData) => setSupervisor(supervisorData))
        .catch(() => setSupervisor(null));
    }
  }, [dispatch, user?.supervisorId]);

  return (
    <div className="student-dashboard">
      <h1>Welcome, {user?.fullName || 'Student'} 👋</h1>

      {user?.supervisorId && supervisor ? (
        <p style={{ marginTop: '1rem' }}>
          You are already assigned to <strong>{supervisor.fullName}</strong>
        </p>
      ) : (
        <p style={{ marginTop: '1rem', color: 'gray' }}>
          You have not been assigned a supervisor yet.
        </p>
      )}
    </div>
  );
};

export default Dashboard;
