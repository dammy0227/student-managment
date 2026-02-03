import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchAllStudents,
  fetchAllSupervisors,
  assignSupervisorToStudent,
} from '../../../features/user/userThunks';
import { getUserProfile } from '../../../features/auth/authThunks';
import './Assign.css';
import {
  FaUserGraduate,
  FaUserTie,
  FaCheckCircle,
  FaExclamationTriangle,
  FaSearch,
  FaFilter,
  FaSpinner,
  FaClipboardCheck,
  FaUsers
} from 'react-icons/fa';

const AssignSupervisor = () => {
  const dispatch = useDispatch();
  const { students, supervisors, status } = useSelector((state) => state.user);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [selectedSupervisors, setSelectedSupervisors] = useState({});
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  useEffect(() => {
    dispatch(fetchAllStudents());
    dispatch(fetchAllSupervisors());
  }, [dispatch]);

  const handleSupervisorChange = (studentId, supervisorId) => {
    setSelectedSupervisors((prev) => ({
      ...prev,
      [studentId]: supervisorId,
    }));
  };

  const handleAssign = (studentId) => {
    const supervisorId = selectedSupervisors[studentId];
    if (!supervisorId) {
      setMessage('Please select a supervisor.');
      setMessageType('warning');
      return;
    }

    const student = students.find((s) => s._id === studentId);
    if (student?.supervisorId) {
      setMessage('This student already has a supervisor.');
      setMessageType('warning');
      return;
    }

    dispatch(assignSupervisorToStudent({ studentId, supervisorId }))
      .unwrap()
      .then(() => {
        setMessage('Supervisor assigned successfully!');
        setMessageType('success');
        dispatch(fetchAllStudents());
        dispatch(getUserProfile());
        
        // Clear selection for this student
        setSelectedSupervisors(prev => {
          const newSelections = { ...prev };
          delete newSelections[studentId];
          return newSelections;
        });
        
        // Clear message after 3 seconds
        setTimeout(() => {
          setMessage('');
          setMessageType('');
        }, 3000);
      })
      .catch(() => {
        setMessage('Failed to assign supervisor. Please try again.');
        setMessageType('error');
      });
  };

  const filteredStudents = students.filter((student) => {
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

  const assignedCount = students.filter((s) => s.supervisorId).length;
  const unassignedCount = students.length - assignedCount;

  return (
    <div className="assign-container">
      {/* Header Section */}
      <div className="assign-header-section">
        <div className="assign-header">
          <FaClipboardCheck size={28} color="#059669" />
          <h2>Assign Supervisor to Student</h2>
        </div>
        
        <div className="stats-grid">
          <div className="stat-card">
            <h3>Total Students</h3>
            <div className="stat-number total-students">{students.length}</div>
            <div style={{ fontSize: '0.85rem', color: '#6b7280', marginTop: '4px' }}>
              <FaUserGraduate style={{ marginRight: '6px' }} />
              {unassignedCount} pending assignment
            </div>
          </div>
          
          <div className="stat-card">
            <h3>Total Supervisors</h3>
            <div className="stat-number total-supervisors">{supervisors.length}</div>
            <div style={{ fontSize: '0.85rem', color: '#6b7280', marginTop: '4px' }}>
              <FaUserTie style={{ marginRight: '6px' }} />
              Available for assignment
            </div>
          </div>
          
          <div className="stat-card">
            <h3>Assigned Students</h3>
            <div className="stat-number total-assigned">{assignedCount}</div>
            <div style={{ fontSize: '0.85rem', color: '#6b7280', marginTop: '4px' }}>
              <FaCheckCircle style={{ marginRight: '6px' }} />
              {(students.length > 0 ? (assignedCount / students.length * 100).toFixed(1) : 0)}% complete
            </div>
          </div>
        </div>
      </div>

      {/* Message Display */}
      {message && (
        <div className="message-container">
          <div className={`message ${messageType}`}>
            {messageType === 'success' && <FaCheckCircle />}
            {messageType === 'error' && <FaExclamationTriangle />}
            {messageType === 'warning' && <FaExclamationTriangle />}
            {message}
          </div>
        </div>
      )}

      {/* Filter Controls */}
      <div className="filter-controls">
        <div style={{ position: 'relative', flex: 1 }}>
          <FaSearch 
            style={{
              position: 'absolute',
              left: '20px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#9ca3af'
            }}
          />
          <input
            type="text"
            placeholder="Search by name or matric number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
            style={{ paddingLeft: '50px' }}
          />
        </div>
        
        <div style={{ position: 'relative' }}>
          <FaFilter 
            style={{
              position: 'absolute',
              left: '20px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#9ca3af',
              zIndex: 1
            }}
          />
          <select 
            value={filterType} 
            onChange={(e) => setFilterType(e.target.value)}
            className="filter-select"
            style={{ paddingLeft: '50px' }}
          >
            <option value="all">All Students ({students.length})</option>
            <option value="assigned">Assigned ({assignedCount})</option>
            <option value="unassigned">Unassigned ({unassignedCount})</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Student Name</th>
              <th>Matric Number</th>
              <th>Select Supervisor</th>
              <th>Assign</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {status === 'loading' && filteredStudents.length === 0 ? (
              <tr>
                <td colSpan="5" className="loading-row">
                  <div className="loading-spinner"></div>
                  <div style={{ marginTop: '1rem', color: '#6b7280' }}>
                    Loading students...
                  </div>
                </td>
              </tr>
            ) : filteredStudents.length === 0 ? (
              <tr>
                <td colSpan="5" className="empty-state">
                  <FaUsers className="empty-state-icon" />
                  <h3>No students found</h3>
                  <p>Try adjusting your search or filter criteria</p>
                </td>
              </tr>
            ) : (
              filteredStudents.map((student) => {
                const isAssigned = !!student.supervisorId;
                const isSelecting = selectedSupervisors[student._id] && !isAssigned;
                
                return (
                  <tr key={student._id}>
                    <td className="name">{student.fullName}</td>
                    <td>
                      <span className="matric">{student.matricNumber}</span>
                    </td>
                    <td style={{ minWidth: '250px' }}>
                      <select
                        value={selectedSupervisors[student._id] || ''}
                        onChange={(e) =>
                          handleSupervisorChange(student._id, e.target.value)
                        }
                        disabled={isAssigned}
                        className="supervisor-select"
                      >
                        <option value="">-- Select Supervisor --</option>
                        {supervisors.map((sup) => (
                          <option key={sup._id} value={sup._id}>
                            {sup.fullName} {sup.department ? `(${sup.department})` : ''}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td>
                      {!isAssigned ? (
                        <button
                          onClick={() => handleAssign(student._id)}
                          disabled={!selectedSupervisors[student._id] || status === 'loading'}
                          className="assign-btn"
                        >
                          {status === 'loading' && isSelecting ? (
                            <>
                              <FaSpinner className="spinner" /> Assigning...
                            </>
                          ) : (
                            'Assign'
                          )}
                        </button>
                      ) : (
                        <span style={{ color: '#9ca3af', fontStyle: 'italic' }}>
                          Already assigned
                        </span>
                      )}
                    </td>
                    <td>
                      {isAssigned ? (
                        <span className="status assigned">
                          <FaCheckCircle /> Assigned
                        </span>
                      ) : (
                        <span className="status pending">
                          <FaExclamationTriangle /> Pending
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AssignSupervisor;