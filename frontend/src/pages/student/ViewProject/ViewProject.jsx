import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMyProjects } from '../../../features/project/projectThunks';
import { setCurrentProject } from '../../../features/project/projectSlice';
import './ViewProject.css';
import { useNavigate } from 'react-router-dom';
import io from 'socket.io-client';

const socket = io();

const ViewProjects = () => {
  const dispatch = useDispatch();
  const { projects, status, error, currentProject } = useSelector((state) => state.project);
  // Use an object to track expanded projects instead of Set
  const [expandedProjects, setExpandedProjects] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchMyProjects());

    socket.on('projectStatusUpdated', () => {
      dispatch(fetchMyProjects());
    });

    return () => {
      socket.off('projectStatusUpdated');
    };
  }, [dispatch]);

  // Toggle expand for given projectId
  const toggleExpand = (projectId) => {
    setExpandedProjects((prev) => ({
      ...prev,
      [projectId]: !prev[projectId], // toggle true/false
    }));
  };

  const handleSelectProject = (project) => {
    dispatch(setCurrentProject(project));
    navigate(`/student/upload-file/${project._id}`);
  };

  return (
    <div className="page-container">
      {currentProject && (
        <p className="info">
          ✅ Selected Project: <strong>{currentProject.title}</strong>
        </p>
      )}

      {status === 'loading' && <p>Loading...</p>}
      {status === 'failed' && <p className="error">{error}</p>}
      {projects.length === 0 && status === 'succeeded' && (
        <p>You haven’t submitted any projects yet.</p>
      )}

      <div className="project-list">
        {projects.map((project) => {
          const description = (project.description || '').trim();
          const words = description.split(/\s+/);
          const isExpanded = expandedProjects[project._id];
          const shortDesc = words.slice(0, 20).join(' ');

          return (
            <div key={project._id} className="project-card">
              <h3>{project.title}</h3>
              <p style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                {isExpanded ? description : shortDesc + (words.length > 20 ? '...' : '')}
                {words.length > 20 && (
                  <button
                    onClick={() => toggleExpand(project._id)}
                    className="show-more"
                    aria-label={isExpanded ? 'Read less' : 'Read more'}
                    type="button"
                  >
                    {isExpanded ? ' Read Less' : ' Read More'}
                  </button>
                )}
              </p>
              <p>Status: <strong>{project.status}</strong></p>
              {project.supervisor && (
                <p>Supervisor: {project.supervisor.fullName} ({project.supervisor.email})</p>
              )}
              <button
                onClick={() => handleSelectProject(project)}
                className="select-btn"
                type="button"
              >
                Select Proposal
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ViewProjects;
