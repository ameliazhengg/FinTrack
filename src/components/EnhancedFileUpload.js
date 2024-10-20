import React, { useState } from 'react';
import axios from 'axios';
import './EnhancedFileUpload.css';

/**
 * EnhancedFileUpload component allows users to upload CSV files.
 * 
 * This component provides drag-and-drop functionality and manual file selection 
 * for uploading CSV files. It displays the upload progress, handles errors, and 
 * updates the table data upon successful file upload.
 * 
 * Props:
 * - setTableData (function): A callback to update the table data in the parent component.
 * 
 * Example usage:
 * <EnhancedFileUpload setTableData={setTableData} />
 * 
 * Related components: App, FinTrackTable
 */
function EnhancedFileUpload({ setTableData }) {
  // State variables for managing file selection, errors, upload progress, and drag state
  const [file, setFile] = useState(null);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  /**
   * Handles file selection from the file input element.
   * 
   * @param {Event} e - The change event from the file input.
   */
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    handleFileSelection(selectedFile);
  };

  /**
   * Validates and sets the selected file.
   * 
   * @param {File} selectedFile - The file selected by the user.
   * 
   * This function checks if the selected file is a CSV, sets it if valid, 
   * or sets an error message if invalid.
   */
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

  /**
   * Uploads the selected CSV file to the server.
   * 
   * This function uses Axios to send the file to the backend API endpoint.
   * It handles errors, displays progress, and resets the form upon success.
   */
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
        setTableData(response.data);  // Update table data with new data
        setIsError(false);
        setErrorMessage('');
        setFile(null);  // Reset file state
        setUploadProgress(0);  // Reset upload progress
        setIsDragging(false);  // Reset dragging state
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

  /**
   * Handles drag-over event for drag-and-drop functionality.
   * 
   * @param {Event} e - The drag-over event.
   * 
   * This function sets the drag state to true, indicating that a file is being dragged.
   */
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  /**
   * Handles drag-leave event for drag-and-drop functionality.
   * 
   * This function sets the drag state to false, indicating that a file is no longer being dragged.
   */
  const handleDragLeave = () => {
    setIsDragging(false);
  };

  /**
   * Handles file drop event for drag-and-drop functionality.
   * 
   * @param {Event} e - The drop event.
   * 
   * This function extracts the dropped file and triggers file selection handling.
   */
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
