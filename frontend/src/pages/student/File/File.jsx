import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { uploadFile, fetchFiles } from '../../../features/file/fileThunks';
import { clearUploadStatus } from '../../../features/file/fileSlice';
import { selectCurrentProject } from '../../../features/project/projectSlice';
import { useParams } from 'react-router-dom';
import { io } from 'socket.io-client';
import './File.css'; // Make sure this shares styles with SupervisorProjectFiles.css

const File = () => {
  const dispatch = useDispatch();
  const project = useSelector(selectCurrentProject);
  const { projectId } = useParams();
  const { files, loading, error, successMessage } = useSelector((state) => state.file);
  const studentId = useSelector((state) => state.auth.user?._id);

  const [selectedFile, setSelectedFile] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const socket = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000');
    socket.on('statusUpdated', (data) => {
      if (data.studentId === studentId) {
        alert(data.message);
      }
    });
    return () => socket.disconnect();
  }, [studentId]);

  useEffect(() => {
    const pid = projectId || project?._id;
    if (pid) dispatch(fetchFiles(pid));
  }, [dispatch, projectId, project]);

  useEffect(() => {
    if (successMessage || error) {
      const timeout = setTimeout(() => dispatch(clearUploadStatus()), 3000);
      return () => clearTimeout(timeout);
    }
  }, [successMessage, error, dispatch]);

  const handleFileChange = (e) => setSelectedFile(e.target.files[0]);

  const handleUpload = (e) => {
    e.preventDefault();
    const pid = projectId || project?._id;
    if (!selectedFile || !pid) return;

    dispatch(uploadFile({ file: selectedFile, projectId: pid }))
      .unwrap()
      .then(() => {
        setSelectedFile(null);
        dispatch(fetchFiles(pid));
      })
      .catch((err) => console.error('Upload failed:', err));
  };

  if (!projectId && !project?._id) {
    return (
      <div className="file-upload-containers">
        <h2>Upload File</h2>
        <p className="error">Please select or submit a project first before uploading files.</p>
      </div>
    );
  }

  return (
    <div className="file-upload-containers">
      <h2>📁 Upload Project Files</h2>

      <form onSubmit={handleUpload} className="upload-form">
        <input type="file" onChange={handleFileChange} />
        <button type="submit" disabled={!selectedFile || loading}>
          {loading ? 'Uploading...' : 'Upload'}
        </button>
      </form>

      {successMessage && <p className="success">{successMessage}</p>}
      {error && <p className="error">{error}</p>}

      <div className="flex-file">
        {files && files.length > 0 ? (
          files.map((file) => {
            const fileType = file.fileName?.split('.').pop().toLowerCase();
            const fileUrl = file.fileUrl;
            const isImage = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'].includes(fileType);
            const isDoc = ['doc', 'docx'].includes(fileType);
            const isPDF = fileType === 'pdf';

            return (
              <div key={file._id} className="project-card">
                <p><strong>{file.fileName}</strong></p>
                <p style={{ fontWeight: 'bold', color: 'green' }}>
                  📌 Project: {project?.title || 'N/A'}
                </p>
                <p>
                  Status:{' '}
                  <span className={`status-tag ${file.status?.toLowerCase() || 'pending'}`}>
                    {file.status || 'Pending'}
                  </span>
                </p>

                {(isImage || isPDF || isDoc) && (
                  <div className="file-preview-containers">
                    {isPDF ? (
                      <iframe
                        src={fileUrl}
                        width="100%"
                        height="500px"
                        title={file.fileName}
                        frameBorder="0"
                      />
                    ) : isImage ? (
                      <img src={fileUrl} alt={file.fileName} />
                    ) : (
                      <iframe
                        src={`https://docs.google.com/gview?url=${encodeURIComponent(fileUrl)}&embedded=true`}
                        title={file.fileName}
                        className="file-preview-doc"
                      />
                    )}
                  </div>
                )}

                <div className="action-buttons">
                  <a
                    href={fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="open-btn"
                  >
                    🔗 Open
                  </a>

                  {isMobile && (
                    <a
                      href={fileUrl}
                      target="_blank"
                      download
                      rel="noopener noreferrer"
                      className="open-btn"
                    >
                      📂 Open with...
                    </a>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <p>No files uploaded yet.</p>
        )}
      </div>
    </div>
  );
};

export default File;
