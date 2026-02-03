import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllStudents, fetchAllSupervisors } from '../../../features/user/userThunks';

import './AdminDashboard.css';
import {
  FaUserGraduate,
  FaUserTie,
  FaClipboardCheck,
  FaUserTimes,
  FaArrowUp,
  FaArrowDown,
  FaChartLine,
  FaChartPie
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
  CartesianGrid,
  Legend,
  AreaChart,
  Area,
  LineChart,
  Line,
  Label
} from 'recharts';

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const { students, supervisors } = useSelector((state) => state.user);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      await Promise.all([
        dispatch(fetchAllStudents()),
        dispatch(fetchAllSupervisors())
      ]);
      setLoading(false);
    };
    loadData();
  }, [dispatch]);

  // Enhanced counts with statistics
  const assignedCount = students.filter(s => s.supervisorId).length;
  const unassignedCount = students.length - assignedCount;
  const avgSupervisorLoad = supervisors.length > 0 ? (assignedCount / supervisors.length).toFixed(1) : 0;
  
  // Calculate assignment rate
  const assignmentRate = students.length > 0 ? ((assignedCount / students.length) * 100).toFixed(1) : 0;
  
  // Supervisor load distribution
  const supervisorData = supervisors.map(s => {
    const assignedStudents = students.filter(stu => stu.supervisorId === s._id);
    return {
      name: s.fullName.split(' ')[0], // First name only for better display
      fullName: s.fullName,
      assigned: assignedStudents.length,
      capacity: 10, // Assuming each supervisor can take 10 students
      utilization: Math.min((assignedStudents.length / 10) * 100, 100)
    };
  }).sort((a, b) => b.assigned - a.assigned);



  // Monthly assignment trend (mock data for demonstration)
  const monthlyTrend = [
    { month: 'Jan', assigned: 12, unassigned: 8 },
    { month: 'Feb', assigned: 18, unassigned: 5 },
    { month: 'Mar', assigned: 22, unassigned: 3 },
    { month: 'Apr', assigned: 25, unassigned: 2 },
    { month: 'May', assigned: 28, unassigned: 1 },
    { month: 'Jun', assigned: 30, unassigned: 0 },
  ];

  // Custom tooltip for pie chart
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <div style={{ 
            background: 'white', 
            padding: '12px', 
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
          }}>
            <p style={{ 
              fontWeight: 600, 
              margin: 0,
              color: '#1e293b'
            }}>{payload[0].name}</p>
            <p style={{ 
              margin: '4px 0 0 0',
              color: '#64748b'
            }}>{payload[0].value} students</p>
            <p style={{ 
              margin: '2px 0 0 0',
              color: '#64748b',
              fontSize: '12px'
            }}>{payload[0].payload.percentage}% of total</p>
          </div>
        </div>
      );
    }
    return null;
  };

  // Bar chart custom tooltip
  const BarTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{
          background: 'white',
          padding: '12px',
          border: '1px solid #e2e8f0',
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
        }}>
          <p style={{ fontWeight: 600, margin: 0 }}>{label}</p>
          <p style={{ margin: '4px 0 0 0', color: '#475569' }}>
            Students: <strong>{payload[0].value}</strong>
          </p>
          <p style={{ margin: '2px 0 0 0', color: '#64748b', fontSize: '12px' }}>
            Utilization: {payload[0].payload.utilization.toFixed(0)}%
          </p>
        </div>
      );
    }
    return null;
  };

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

  if (loading) {
    return (
      <div className="admin-dashboard">
        <div className="loading">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      {/* HEADER */}
      <div className="dashboard-header">
        <h1>Admin Dashboard</h1>
        <p>Monitor and manage student-supervisor assignments with real-time analytics</p>
      </div>

      {/* KPI CARDS */}
      <div className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-icon blue"><FaUserGraduate /></div>
          <div className="kpi-content">
            <span>Total Students</span>
            <h2>{students.length}</h2>
            <p className="trend up">
              <FaArrowUp /> {assignmentRate}% assigned
            </p>
          </div>
        </div>
        
        <div className="kpi-card">
          <div className="kpi-icon green"><FaUserTie /></div>
          <div className="kpi-content">
            <span>Total Supervisors</span>
            <h2>{supervisors.length}</h2>
            <p className="trend up">
              <FaArrowUp /> Avg. load: {avgSupervisorLoad}
            </p>
          </div>
        </div>
        
        <div className="kpi-card">
          <div className="kpi-icon yellow"><FaClipboardCheck /></div>
          <div className="kpi-content">
            <span>Assigned Students</span>
            <h2>{assignedCount}</h2>
            <p className="trend up">
              <FaArrowUp /> {assignmentRate}% completion
            </p>
          </div>
        </div>
        
        <div className="kpi-card">
          <div className="kpi-icon red"><FaUserTimes /></div>
          <div className="kpi-content">
            <span>Unassigned Students</span>
            <h2>{unassignedCount}</h2>
            <p className={unassignedCount > 0 ? "trend down" : "trend up"}>
              {unassignedCount > 0 ? <FaArrowDown /> : <FaArrowUp />}
              {unassignedCount > 0 ? " Needs attention" : " All assigned"}
            </p>
          </div>
        </div>
      </div>

      {/* ENHANCED CHARTS SECTION */}
      <div className="charts-grid">
        {/* Supervisor Load Bar Chart */}
        <div className="chart-card">
          <div className="chart-header">
            <h3>Supervisor Load Distribution</h3>
            <div className="chart-legend">
              <div className="legend-item">
                <div className="legend-color" style={{ background: '#2e7d32' }}></div>
                <span>Students Assigned</span>
              </div>
              <div className="legend-item">
                <div className="legend-color" style={{ background: '#e2e8f0' }}></div>
                <span>Capacity</span>
              </div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={supervisorData}
              margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#2e7d32" vertical={false} />
              <XAxis 
                dataKey="name" 
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#64748b', fontSize: 12 }}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#64748b', fontSize: 12 }}
              >
                <Label 
                  value="Number of Students" 
                  angle={-90} 
                  position="insideLeft"
                  offset={-10}
                  style={{ textAnchor: 'middle', fill: '#2e7d32' }}
                />
              </YAxis>
              <ReTooltip content={<BarTooltip />} />
              <Legend 
                verticalAlign="bottom"
                height={36}
                iconType="circle"
              />
              <Bar 
                dataKey="capacity" 
                name="Capacity" 
                fill="#5dbd62" 
                radius={[8, 8, 0, 0]}
                stackId="a"
              />
              <Bar 
                dataKey="assigned" 
                name="Assigned Students" 
                fill="#5dbd62" 
                radius={[8, 8, 0, 0]}
                stackId="a"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

  

        {/* Monthly Trend Line Chart */}
        <div className="chart-card">
          <div className="chart-header">
            <h3>Assignment Trend (Last 6 Months)</h3>
            <div className="chart-legend">
              <div className="legend-item">
                <div className="legend-color" style={{ background: '#4caf50' }}></div>
                <span>Assigned</span>
              </div>
              <div className="legend-item">
                <div className="legend-color" style={{ background: '#f44336' }}></div>
                <span>Unassigned</span>
              </div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart
              data={monthlyTrend}
              margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis 
                dataKey="month" 
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#64748b' }}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#64748b' }}
              />
              <ReTooltip />
              <Area 
                type="monotone" 
                dataKey="assigned" 
                name="Assigned" 
                stroke="#4caf50" 
                fill="#4caf50" 
                fillOpacity={0.2}
                strokeWidth={2}
              />
              <Area 
                type="monotone" 
                dataKey="unassigned" 
                name="Unassigned" 
                stroke="#f44336" 
                fill="#f44336" 
                fillOpacity={0.2}
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* STUDENT SUPERVISOR TABLE */}
      <div className="assign-table-section">
        <h3>Student Supervisor Assignments</h3>

        <div className="filter-controls">
          <input
            type="text"
            placeholder="Search by name or matric number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
            <option value="all">All Students ({students.length})</option>
            <option value="assigned">Assigned Only ({assignedCount})</option>
            <option value="unassigned">Unassigned Only ({unassignedCount})</option>
          </select>
        </div>

        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Student Name</th>
                <th>Matric Number</th>
                <th>Department</th>
                <th>Supervisor</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {filteredStudents.map(student => {
                const supervisor = supervisors.find(s => s._id === student.supervisorId);

                return (
                  <tr key={student._id}>
                    <td>
                      <div>
                        <strong>{student.fullName}</strong>
                      </div>
                    </td>
                    <td>{student.matricNumber}</td>
                    <td>{student.department || <span className="muted">Not specified</span>}</td>
                    <td>
                      {student.supervisorId ? (
                        <div>
                          <strong>{supervisor?.fullName}</strong>
                          {supervisor?.department && (
                            <div style={{ fontSize: '12px', color: '#64748b' }}>
                              {supervisor.department}
                            </div>
                          )}
                        </div>
                      ) : (
                        <span className="muted">Awaiting assignment</span>
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
              {filteredStudents.length === 0 && (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '40px' }}>
                    <div style={{ color: '#64748b', fontSize: '14px' }}>
                      No students found matching your criteria
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default AdminDashboard;