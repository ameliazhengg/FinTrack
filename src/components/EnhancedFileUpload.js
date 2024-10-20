import React, { useState } from 'react';
import axios from 'axios';
import './EnhancedFileUpload.css';

function EnhancedFileUpload({ setTableData }) {
  const [file, setFile] = useState(null);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false); // For drag-and-drop styling

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    handleFileSelection(selectedFile);
  };

  const handleFileSelection = (selectedFile) => {
    if (selectedFile && selectedFile.type.includes('csv')) {
      setFile(selectedFile);
      setIsError(false);
      setErrorMessage('');
    } else {
      setIsError(true);
      setErrorMessage('Invalid file type. Please select a CSV file.');
      setFile(null);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setIsError(true);
      setErrorMessage('No file selected. Please choose a CSV file.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent) => {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(progress);
        },
      });

      if (response.status === 200) {
        setTableData(response.data);
        setIsError(false);
        setErrorMessage('');
        setFile(null); // Reset file
        setUploadProgress(0); // Reset progress
        setIsDragging(false); // Reset dragging state
      } else {
        setIsError(true);
        setErrorMessage(`Server error: ${response.data?.error || 'Unknown error'}`);
      }
    } catch (error) {
      setIsError(true);
      const serverError = error.response?.data?.error || error.message || 'Unknown error occurred.';
      setErrorMessage(`Upload error: ${serverError}`);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);

    const droppedFile = e.dataTransfer.files[0];
    handleFileSelection(droppedFile);
  };

  return (
    <div 
      className={`file-upload-container ${isDragging ? 'dragging' : ''}`} 
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <h2 className="file-upload-heading">Upload CSV File</h2>

      <div className={`file-upload-box ${file ? 'file-selected' : ''} ${isDragging ? 'drag-hover' : ''}`}>
        <input
          type="file"
          id="file-input"
          className="file-input"
          accept=".csv"
          onChange={handleFileChange}
        />

        <label htmlFor="file-input" className="file-label">
          {file ? file.name : 'Drag & drop your CSV here or click to browse'}
        </label>

        <button 
          className={`upload-button ${file ? '' : 'disabled'}`}
          onClick={handleUpload}
          disabled={!file || uploadProgress > 0}
        >
          Upload
        </button>

        {isError && <div className="file-error">{errorMessage}</div>}
        {uploadProgress > 0 && <div className="upload-progress">Progress: {uploadProgress}%</div>}
      </div>
    </div>
  );
}

export default EnhancedFileUpload;
