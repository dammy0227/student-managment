import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllStudents, fetchAllSupervisors } from '../../../features/user/userThunks';

import './AdminDashboard.css';
import {
  FaUserGraduate,
  FaUserTie,
  FaClipboardCheck,
  FaUserTimes,
} from 'react-icons/fa';

import {
  PieChart,
  Pie,
  Cell,
  Tooltip as ReTooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Legend,
} from 'recharts';

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const { students, supervisors } = useSelector((state) => state.user);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  useEffect(() => {
    dispatch(fetchAllStudents());
    dispatch(fetchAllSupervisors());
  }, [dispatch]);

  // Counts
  const assignedCount = students.filter(s => s.supervisorId).length;
  const unassignedCount = students.length - assignedCount;

  // Chart Data
  const supervisorData = supervisors.map(s => ({
    name: s.fullName,
    assigned: students.filter(stu => stu.supervisorId === s._id).length,
  }));

  const pieData = [
    { name: 'Assigned', value: assignedCount },
    { name: 'Unassigned', value: unassignedCount },
  ];
  const COLORS = ['#4caf50', '#f44336'];

  // Filtered students
  const filteredStudents = students.filter(student => {
    const matchesSearch =
      student.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.matricNumber.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter =
      filterType === 'all'
        ? true
        : filterType === 'assigned'
        ? !!student.supervisorId
        : !student.supervisorId;

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="admin-dashboard">

      {/* HEADER */}
      <div className="dashboard-header">
        <h1>Admin Dashboard</h1>
        <p>Overview of student & supervisor activities</p>
      </div>

      {/* KPI CARDS */}
      <div className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-icon blue"><FaUserGraduate /></div>
          <div>
            <span>Total Students</span>
            <h2>{students.length}</h2>
            <p className="trend up">Active</p>
          </div>
        </div>
        <div className="kpi-card">
          <div className="kpi-icon green"><FaUserTie /></div>
          <div>
            <span>Total Supervisors</span>
            <h2>{supervisors.length}</h2>
            <p className="trend up">Growth</p>
          </div>
        </div>
        <div className="kpi-card highlight">
          <div className="kpi-icon yellow"><FaClipboardCheck /></div>
          <div>
            <span>Assigned Students</span>
            <h2>{assignedCount}</h2>
            <p className="trend up">Assigned</p>
          </div>
        </div>
        <div className="kpi-card danger">
          <div className="kpi-icon red"><FaUserTimes /></div>
          <div>
            <span>Unassigned Students</span>
            <h2>{unassignedCount}</h2>
            <p className="trend down">Needs attention</p>
          </div>
        </div>
      </div>

      {/* CHARTS */}
      <div className="charts-grid">
        <div className="chart-card">
          <h3>Supervisor Load</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={supervisorData}>
              <XAxis dataKey="name" tickLine={false} axisLine={false} />
              <YAxis tickLine={false} axisLine={false} />
              <ReTooltip />
              <Legend />
              <Bar dataKey="assigned" fill="#4caf50" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="chart-card">
          <h3>Assignment Status</h3>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                innerRadius={70}
                outerRadius={100}
                paddingAngle={5}
              >
                {pieData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i]} />
                ))}
              </Pie>
              <ReTooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* STUDENT SUPERVISOR TABLE */}
      <div className="assign-table-section">
        <h3>Student Supervisor Assignments</h3>

        <div className="filter-controls">
          <input
            type="text"
            placeholder="Search by name or matric number"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
            <option value="all">All Students</option>
            <option value="assigned">Assigned</option>
            <option value="unassigned">Unassigned</option>
          </select>
        </div>

        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Student Name</th>
                <th>Matric Number</th>
                <th>Supervisor</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {filteredStudents.map(student => {
                const supervisor = supervisors.find(s => s._id === student.supervisorId);

                return (
                  <tr key={student._id}>
                    <td>{student.fullName}</td>
                    <td>{student.matricNumber}</td>
                    <td>
                      {student.supervisorId ? (
                        <strong>{supervisor?.fullName}</strong>
                      ) : (
                        <span className="muted">No supervisor assigned</span>
                      )}
                    </td>
                    <td>
                      {student.supervisorId ? (
                        <span className="status assigned">Assigned</span>
                      ) : (
                        <span className="status pending">Pending</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default AdminDashboard;
