import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchAllStudents,
  fetchAllSupervisors,
  assignSupervisorToStudent,
} from '../../../features/user/userThunks';
import { getUserProfile } from '../../../features/auth/authThunks'; // ✅ Added for Fix #3
import './Assign.css';

const AssignSupervisor = () => {
  const dispatch = useDispatch();
  const { students, supervisors, status } = useSelector((state) => state.user);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [selectedSupervisors, setSelectedSupervisors] = useState({});
  const [message, setMessage] = useState('');

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
      setMessage('❌ Please select a supervisor.');
      return;
    }

    const student = students.find((s) => s._id === studentId);
    if (student?.supervisorId) {
      setMessage('⚠️ Student already has a supervisor.');
      return;
    }

    dispatch(assignSupervisorToStudent({ studentId, supervisorId }))
      .unwrap()
      .then(() => {
        setMessage('✅ Supervisor assigned!');
        dispatch(fetchAllStudents());

        // ✅ Fix #3: Refresh current user's profile in case they're the assigned student
        dispatch(getUserProfile());
      })
      .catch(() => {
        setMessage('❌ Failed to assign supervisor.');
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

  return (
    <div className="assign-container">
      <div className="assign">
        <div className="assign-header">
          <h2>🧑‍🏫 Assign Supervisor to Student</h2>
        </div>

        <div className="assign-number">
          <p>Total Students: {students.length}</p>
          <p>Total Supervisors: {supervisors.length}</p>
          <p>Total Assigned: {assignedCount}</p>
        </div>
      </div>

      {message && (
        <p className={`message ${message.includes('✅') ? 'success' : 'error'}`}>
          {message}
        </p>
      )}

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
              <th>Select Supervisor</th>
              <th>Assign</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.map((student) => (
              <tr key={student._id}>
                <td className="name">{student.fullName}</td>
                <td className="matric">{student.matricNumber}</td>
                <td>
                  <select
                    value={selectedSupervisors[student._id] || ''}
                    onChange={(e) =>
                      handleSupervisorChange(student._id, e.target.value)
                    }
                    disabled={!!student.supervisorId}
                  >
                    <option value="">-- Select --</option>
                    {supervisors.map((sup) => (
                      <option key={sup._id} value={sup._id}>
                        {sup.fullName}
                      </option>
                    ))}
                  </select>
                </td>
                <td>
                  {!student.supervisorId ? (
                    <button
                      onClick={() => handleAssign(student._id)}
                      disabled={status === 'loading'}
                    >
                      Assign
                    </button>
                  ) : (
                    '—'
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
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AssignSupervisor;
