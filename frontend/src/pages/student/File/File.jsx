import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { uploadFile, fetchFiles } from '../../../features/file/fileThunks';
import { clearUploadStatus } from '../../../features/file/fileSlice';
import { useParams } from 'react-router-dom';
import { io } from 'socket.io-client';
import './File.css';

const File = () => {
  const dispatch = useDispatch();
  const { projectId } = useParams(); 
  const { files, loading, error, successMessage } = useSelector((state) => state.file);
  const studentId = useSelector((state) => state.auth.user?._id);

  const [selectedFile, setSelectedFile] = useState(null);
  const [zoomedFileId, setZoomedFileId] = useState(null);
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
    if (projectId) {
      dispatch(fetchFiles(projectId));
    }
  }, [dispatch, projectId]);

  useEffect(() => {
    if (successMessage || error) {
      const timeout = setTimeout(() => dispatch(clearUploadStatus()), 3000);
      return () => clearTimeout(timeout);
    }
  }, [successMessage, error, dispatch]);

  const handleFileChange = (e) => setSelectedFile(e.target.files[0]);

  const handleUpload = (e) => {
    e.preventDefault();
    if (!selectedFile || !projectId) return;

    dispatch(uploadFile({ file: selectedFile, projectId }))
      .unwrap()
      .then(() => {
        setSelectedFile(null);
        dispatch(fetchFiles(projectId));
      })
      .catch((err) => console.error('Upload failed:', err));
  };

  const toggleZoom = (fileId) => {
    setZoomedFileId((prev) => (prev === fileId ? null : fileId));
  };

  return (
    <div className="file-upload-container">
      <h2>Upload Files</h2>

      <form onSubmit={handleUpload} className="upload-form">
        <input type="file" onChange={handleFileChange} />
        <button type="submit" disabled={!selectedFile || loading}>
          {loading ? 'Uploading...' : 'Upload'}
        </button>
      </form>

      {successMessage && <p className="success">{successMessage}</p>}
      {error && <p className="error">{error}</p>}

      <div className="file-list">
        <h3>Uploaded Files</h3>
        {files.length > 0 ? (
          <ul className="file-items-list">
            {files.map((file) => {
              const fileType = file.fileName?.split('.').pop().toLowerCase();
              const fileUrl = file.fileUrl;
              const isZoomed = zoomedFileId === file._id;
              const isImage = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'].includes(fileType);
              const isDoc = ['doc', 'docx'].includes(fileType);
              const isPDF = fileType === 'pdf';

              return (
                <li key={file._id} className="file-item">
                  <div className="file-info">
                    <p><strong>{file.fileName}</strong></p>
                    <p>Status: <span className={`status-tag ${file.status?.toLowerCase() || 'pending'}`}>
                      {file.status || 'Pending'}
                    </span></p>
                  </div>

                  {(isImage || isPDF || isDoc) && (
                    <div className="file-preview-container">
                      {!isMobile ? (
                        isPDF ? (
                          <object data={fileUrl} type="application/pdf" width="100%" height="100%">
                            <p>Your browser does not support embedded PDFs.</p>
                          </object>
                        ) : isImage ? (
                          <img src={fileUrl} alt={file.fileName} />
                        ) : (
                          <iframe
                            src={`https://docs.google.com/gview?url=${fileUrl}&embedded=true`}
                            title={file.fileName}
                            className="file-preview-doc"
                          />
                        )
                      ) : (
                        <div style={{ marginTop: '0.5rem' }}>
                          <a
                            href={fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            download
                            className="open-btn"
                          >
                            📂 Open or Download
                          </a>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="action-buttons">
                    {!isMobile && (isImage || isPDF || isDoc) && (
                      <button className="zoom-btn" onClick={() => toggleZoom(file._id)}>
                        {isZoomed ? 'Close Zoom' : 'Zoom'}
                      </button>
                    )}
                  </div>

                  {isZoomed && !isMobile && (
                    <div className="file-zoom-overlay">
                      <div className="file-zoom-content">
                        <button className="close-zoom-btn" onClick={() => toggleZoom(file._id)}>✖</button>
                        {isPDF ? (
                          <embed src={fileUrl} type="application/pdf" width="100%" height="600px" />
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
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        ) : (
          <p>No files uploaded yet.</p>
        )}
      </div>
    </div>
  );
};

export default File;
