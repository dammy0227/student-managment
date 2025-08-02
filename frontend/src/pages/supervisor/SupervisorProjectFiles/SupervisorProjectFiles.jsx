import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSupervisorFiles, updateDocumentStatus, markFilesAsRead } from '../../../features/file/fileThunks';
import { useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import './SupervisorProjectFiles.css';
import { getUserProfile } from '../../../features/auth/authThunks';

const SupervisorFileViewer = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { files, loading, error } = useSelector((state) => state.file);
  const supervisorId = useSelector((state) => state.auth.user?._id);
  const [zoomedFile, setZoomedFile] = useState(null);
  const [expandedStudents, setExpandedStudents] = useState({});
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    dispatch(fetchSupervisorFiles());
    dispatch(markFilesAsRead());
  }, [dispatch]);

  useEffect(() => {
    const socket = io('http://localhost:5000');
    socket.on('fileUploaded', (data) => {
      if (data.supervisorId === supervisorId) {
        dispatch(fetchSupervisorFiles());
        alert(`📁 ${data.studentName} just uploaded a new file!`);
      }
    });
    return () => socket.disconnect();
  }, [dispatch, supervisorId]);

  useEffect(() => {
    dispatch(getUserProfile()).catch((err) =>
      console.error('❌ Failed to load profile:', err)
    );
  }, [dispatch]);

  const toggleZoom = (file, fileUrl, fileType) => {
    if (zoomedFile) {
      document.body.style.overflow = 'auto';
      setZoomedFile(null);
    } else {
      document.body.style.overflow = 'hidden';
      setZoomedFile({ file, fileUrl, fileType });
    }
  };

  const toggleStudent = (studentId) => {
    setExpandedStudents((prev) => ({
      ...prev,
      [studentId]: !prev[studentId],
    }));
  };

  const handleStatusChange = (documentId, status) => {
    dispatch(updateDocumentStatus({ documentId, status }))
      .unwrap()
      .then(() => dispatch(fetchSupervisorFiles()))
      .catch((err) => console.error('Status update failed:', err));
  };

  const filteredFiles = files.filter(
    (file) =>
      file.uploadedBy &&
      file.uploadedBy.role === 'Student' &&
      (file.uploadedBy.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        file.uploadedBy.matricNumber?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const filesByStudent = filteredFiles.reduce((acc, file) => {
    const studentId = file.uploadedBy._id;
    if (!acc[studentId]) {
      acc[studentId] = {
        student: file.uploadedBy,
        files: [],
      };
    }
    acc[studentId].files.push(file);
    return acc;
  }, {});

  return (
    <div className="file-upload-containers">
      <h2>📄 Student Project Files</h2>

      <input
        type="text"
        placeholder="🔍 Search student name or matric"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-box"
      />

      {loading && <p>Loading files...</p>}
      {error && <p className="error">{error}</p>}

      {Object.values(filesByStudent).length === 0 ? (
        <p>No matching student files found.</p>
      ) : (
        Object.values(filesByStudent).map(({ student, files }) => (
          <div key={student._id} className="student-block">
            <div className="student-header" onClick={() => toggleStudent(student._id)}>
              {student.fullName} ({student.matricNumber || 'N/A'})
            </div>

            <div className="flex-file">
              {expandedStudents[student._id] &&
                files.map((file) => {
                  const fileType = file.fileName?.split('.').pop().toLowerCase();
                  const fileUrl = `${import.meta.env.VITE_API_BASE_URL}${file.fileUrl}`;
                  const isImage = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'].includes(fileType);
                  const isDoc = ['doc', 'docx'].includes(fileType);
                  const isPDF = fileType === 'pdf';

                  return (
                    <div key={file._id} className="project-card">
                      <p><strong>{file.fileName}</strong></p>
                      <p style={{ fontWeight: 'bold', color: 'green' }}>
                        📌 Project: {file.project?.title || 'N/A'}
                      </p>
                      <p>
                        Status: <span className={`status-tag ${file.status?.toLowerCase() || 'pending'}`}>
                          {file.status || 'Pending'}
                        </span>
                      </p>

                      {(isImage || isPDF || isDoc) && (
                        <div className="file-preview-containers">
                          {isPDF ? (
                            <object data={fileUrl} type="application/pdf" width="100%" height="100%">
                              <p>
                                Your browser does not support embedded PDFs.
                                <a href={fileUrl} target="_blank" rel="noopener noreferrer">
                                  Click here to view or download the PDF
                                </a>
                              </p>
                            </object>
                          ) : isImage ? (
                            <img src={fileUrl} alt={file.fileName} />
                          ) : (
                            <iframe
                              src={`https://docs.google.com/gview?url=${fileUrl}&embedded=true`}
                              title={file.fileName}
                              className="file-preview-doc"
                            />
                          )}
                        </div>
                      )}

                      {(isImage || isPDF || isDoc) && (
                        <button
                          className="zoom-btn"
                          onClick={() => toggleZoom(file, fileUrl, fileType)}
                        >
                          Zoom
                        </button>
                      )}

                      {file.status === 'Pending' && (
                        <div className="action-buttons">
                          <button className="approve-btn" onClick={() => handleStatusChange(file._id, 'Approved')}>
                            Approve
                          </button>
                          <button className="reject-btn" onClick={() => handleStatusChange(file._id, 'Rejected')}>
                            Reject
                          </button>
                        </div>
                      )}

                      <button
                        className="feedback-btn"
                        onClick={() => navigate(`/supervisor/student/${file.uploadedBy._id}/feedback`)}
                      >
                        Give Feedback
                      </button>
                    </div>
                  );
                })}
            </div>
          </div>
        ))
      )}

      {zoomedFile && (
        <div className="zoom-overlay">
          <div className="zoom-content">
            <button
              className="close-btn"
              onClick={() => {
                document.body.style.overflow = 'auto';
                setZoomedFile(null);
              }}
            >
              ✖
            </button>
            {zoomedFile.fileType === 'pdf' ? (
              <object data={zoomedFile.fileUrl} type="application/pdf" width="100%" height="100%">
                <p>
                  Your browser does not support embedded PDFs.
                  <a href={zoomedFile.fileUrl} target="_blank" rel="noopener noreferrer">
                    Click here to view or download the PDF
                  </a>
                </p>
              </object>
            ) : ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'].includes(zoomedFile.fileType) ? (
              <img src={zoomedFile.fileUrl} alt={zoomedFile.file.fileName} />
            ) : (
              <iframe
                src={`https://docs.google.com/gview?url=${zoomedFile.fileUrl}&embedded=true`}
                title={zoomedFile.file.fileName}
                className="file-preview-s"
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SupervisorFileViewer;
