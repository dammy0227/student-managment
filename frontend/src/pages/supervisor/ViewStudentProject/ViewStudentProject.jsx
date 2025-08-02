import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchAllProjects,
  updateProjectStatus,
  markProjectsAsRead,
} from '../../../features/project/projectThunks';
import './ViewStudentProject.css';
import io from 'socket.io-client';

const socket = io('http://localhost:5000');

const ViewStudentProject = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { projects, status } = useSelector((state) => state.project);

  const [expandedStudents, setExpandedStudents] = useState({});
  const [updatingProjects, setUpdatingProjects] = useState({});
  const [selectedProject, setSelectedProject] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const userRef = useRef(user);

  useEffect(() => {
    userRef.current = user;
  }, [user]);

  useEffect(() => {
    if (user?.role === 'Supervisor') {
      dispatch(fetchAllProjects());
      dispatch(markProjectsAsRead());

      socket.on('projectSubmitted', (data) => {
        if (data.supervisorId === userRef.current?._id) {
          dispatch(fetchAllProjects());
        }
      });

      socket.on('projectStatusUpdated', () => {
        dispatch(fetchAllProjects());
      });
    }

    return () => {
      socket.off('projectSubmitted');
      socket.off('projectStatusUpdated');
    };
  }, [dispatch, user]);

  const handleStatusChange = (projectId, newStatus) => {
    setUpdatingProjects((prev) => ({ ...prev, [projectId]: true }));

    dispatch(updateProjectStatus({ projectId, status: newStatus }))
      .unwrap()
      .finally(() => {
        setUpdatingProjects((prev) => {
          const updated = { ...prev };
          delete updated[projectId];
          return updated;
        });
      });

    socket.emit('projectStatusUpdated', { projectId, newStatus });
  };

  const filteredProjects = projects.filter(
    (p) =>
      p.supervisor &&
      p.supervisor._id === user._id &&
      (p.student.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.student.matricNumber?.toLowerCase() || '').includes(searchTerm.toLowerCase()))
  );

  const projectsByStudent = filteredProjects.reduce((acc, project) => {
    const studentId = project.student._id;
    if (!acc[studentId]) {
      acc[studentId] = {
        student: project.student,
        proposals: [],
      };
    }
    acc[studentId].proposals.push(project);
    return acc;
  }, {});

  const toggleStudent = (studentId) => {
    setExpandedStudents((prev) => ({
      ...prev,
      [studentId]: !prev[studentId],
    }));
  };

  return (
    <div className="supervisor-dashboard">
      <h2>📚 View Student Proposals</h2>

      {/* Search input inside a form with preventDefault */}
      <form onSubmit={(e) => e.preventDefault()}>
        <input
          type="text"
          placeholder="🔍 Search student name or matric"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-box"
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
            }
          }}
        />
      </form>

      {status === 'loading' && <p>Loading projects...</p>}
      {status === 'failed' && <p className="error">Failed to fetch projects</p>}

      {Object.values(projectsByStudent).length === 0 && <p>No matching proposals found.</p>}

      {Object.values(projectsByStudent).map(({ student, proposals }) => (
        <div className="students-flex">
         <div key={student._id} className="student-block">
          <div className="flex-student">
              <div className="student-header" onClick={() => toggleStudent(student._id)}>
                {student.fullName} ({student.matricNumber || 'N/A'})
                 {/* <span className="toggle-arrow">{expandedStudents[student._id] ? '▲' : '▼'}</span> */}
               </div>
          </div>
               {/* <div className="student-header" onClick={() => toggleStudent(student._id)}>
                <strong>{student.fullName}</strong> ({student.matricNumber || 'N/A'})
                 <span className="toggle-arrow">{expandedStudents[student._id] ? '▲' : '▼'}</span>
               </div> */}
        <div className="student-flex">
           {expandedStudents[student._id] &&
            proposals.map((project) => {
              const words = project.description.trim().split(' ');
              const shortDescription = words.slice(0, 15).join(' ');
              const isLong = words.length > 15;
              const isUpdating = updatingProjects[project._id];

              return (
                <div key={project._id} className="project-card">
                  <h4>{project.title}</h4>
                  <p>
                    <strong>Description:</strong> {shortDescription}
                    {isLong && (
                      <>
                        ...{' '}
                        <button
                          className="read-more-btn"
                          onClick={() => setSelectedProject(project)}
                        >
                          Read More
                        </button>
                      </>
                    )}
                  </p>
                  <p><strong>Status:</strong> {project.status}</p>

                  {project.status === 'Pending' && !isUpdating && (
                    <div className="action-buttons">
                      <button onClick={() => handleStatusChange(project._id, 'Approved')}>Approve</button>
                      <button onClick={() => handleStatusChange(project._id, 'Rejected')}>Reject</button>
                    </div>
                  )}
                </div>
              );
            })}
        </div>
        
         </div>
        </div>

      ))}

      {/* Modal for full description */}
      {selectedProject && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>{selectedProject.title}</h3>
            <p><strong>Student:</strong> {selectedProject.student.fullName}</p>
            <p>{selectedProject.description}</p>
            <button className="close-modal-icon" onClick={() => setSelectedProject(null)}>✕</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewStudentProject;
