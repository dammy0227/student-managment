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
  const [modalVisible, setModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState('');
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

  const openModal = (text) => {
    setModalContent(text);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setModalContent('');
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
          const description = project.description || '';
          const shortDesc = description.split(' ').slice(0, 20).join(' ') + '...';

          return (
            <div key={project._id} className="project-card">
              <h3>{project.title}</h3>
              <p>
                {shortDesc}
                {description.split(' ').length > 20 && (
                  <button
                    onClick={() => openModal(description)}
                    className="show-more"
                  >
                    Read More
                  </button>
                )}
              </p>
              <p>Status: <strong>{project.status}</strong></p>
              {project.supervisor && (
                <p>Supervisor: {project.supervisor.fullName} ({project.supervisor.email})</p>
              )}
              <button onClick={() => handleSelectProject(project)} className="select-btn">
                Select Proposal
              </button>
            </div>
          );
        })}
      </div>

      {/* Modal for full description */}
      {modalVisible && (
        <div className="modal-overlay">
          <div className="modal-box">
            <button className="modal-close" onClick={closeModal}>✕</button>
            <h3>Full Description</h3>
            <p>{modalContent}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewProjects;
