import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllStudents, fetchAllSupervisors } from '../../../features/user/userThunks';
import { FaUserGraduate, FaUserTie, FaClipboardCheck } from 'react-icons/fa';
import { Pie, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';
import './AdminDashboard.css';

ChartJS.register(ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const { students, supervisors } = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(fetchAllStudents());
    dispatch(fetchAllSupervisors());
  }, [dispatch]);

  const assignedCount = students.filter((s) => s.supervisorId).length;
  const unassignedCount = students.length - assignedCount;

  const barData = {
    labels: supervisors.map((s) => s.fullName),
    datasets: [
      {
        label: 'Students Assigned',
        data: supervisors.map((s) =>
          students.filter((stu) => stu.supervisorId === s._id).length
        ),
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
      },
    ],
  };

  const pieData = {
    labels: ['Assigned', 'Unassigned'],
    datasets: [
      {
        data: [assignedCount, unassignedCount],
        backgroundColor: ['#4caf50', '#f44336'],
      },
    ],
  };

  return (
    <div className="admin-dashboard">
      <h1>Welcome, Admin 👋</h1>

      <div className="dashboard-cards">
        <div className="card">
          <FaUserGraduate className="card-icon student" />
          <div>
            <h3>Total Students</h3>
            <p>{students.length}</p>
          </div>
        </div>
        <div className="card">
          <FaUserTie className="card-icon supervisor" />
          <div>
            <h3>Total Supervisors</h3>
            <p>{supervisors.length}</p>
          </div>
        </div>
        <div className="card">
          <FaClipboardCheck className="card-icon assigns" />
          <div>
            <h3>Total Assigned</h3>
            <p>{assignedCount}</p>
          </div>
        </div>
      </div>

      <div className="chart-section">
        <div className="chart-box">
          <h4>Assignment Distribution</h4>
          <Pie data={pieData} />
        </div>

        <div className="chart-box">
          <h4>Students per Supervisor</h4>
          <Bar data={barData} />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
