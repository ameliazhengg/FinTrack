import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import './EnhancedFileUpload.css';

/**
 * EnhancedFileUpload Component
 * 
 * This component provides a user interface for uploading CSV files with drag-and-drop 
 * functionality. It includes file validation, upload progress tracking, and error handling.
 * The component is designed to be used within a modal or as a standalone element in a page.
 * 
 * Features:
 * - Drag-and-drop file upload
 * - Manual file selection via file input
 * - CSV file type validation
 * - Upload progress tracking
 * - Error handling and display
 * - Integration with parent component for data updates
 * 
 * Props:
 * - setTableData (function): Callback to update the table data in the parent component 
 *   after a successful file upload.
 * - onClose (function): Callback function to reset the component state when the modal 
 *   or containing element is closed.
 * 
 * Example usage:
 * <EnhancedFileUpload setTableData={updateParentData} onClose={handleModalClose} />
 */

/**
 * EnhancedFileUpload component: Renders a file upload interface with drag-and-drop support.
 * 
 * @param {Object} props - The properties passed to the component.
 * @param {function} props.setTableData - Callback to update parent component with uploaded data.
 * @param {function} props.onClose - Callback to handle component/modal closure.
 * 
 * @returns {JSX.Element} - The rendered EnhancedFileUpload component.
 */
function EnhancedFileUpload({ setTableData, onClose }) {
  // State management for file upload process
  const [file, setFile] = useState(null);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  /**
   * Resets the component state to its initial values.
   * Used when closing the component or after a successful upload.
   */
  const resetState = useCallback(() => {
    setFile(null);
    setIsError(false);
    setErrorMessage('');
    setUploadProgress(0);
    setIsDragging(false);
  }, []);

  /**
   * Handles file selection from the file input element.
   * 
   * @param {React.ChangeEvent<HTMLInputElement>} e - The change event from the file input.
   */
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    handleFileSelection(selectedFile);
  };

  /**
   * Validates and sets the selected file.
   * Ensures only CSV files are accepted.
   * 
   * @param {File} selectedFile - The file selected by the user.
   */
  const handleFileSelection = (selectedFile) => {
    if (
      selectedFile &&
      (selectedFile.name.toLowerCase().endsWith('.csv') || selectedFile.type.includes('csv'))
    ) {
      setFile(selectedFile);
      setIsError(false);
      setErrorMessage('');
      setUploadProgress(0);
    } else {
      setIsError(true);
      setErrorMessage('Invalid file type. Please select a CSV file.');
      setFile(null);
    }
  };

  /**
   * Uploads the selected file to the server.
   * Handles the upload process, including progress tracking and error handling.
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
        setTableData(response.data);  // Update parent component with new data
        resetState();  // Reset component state after successful upload
      } else {
        setIsError(true);
        setErrorMessage(`Server error: ${response.data?.error || 'Unknown error'}`);
        setUploadProgress(0);
        setFile(null);  // Clear the file selection on error
      }
    } catch (error) {
      setIsError(true);
      const serverError = error.response?.data?.error || error.message || 'Unknown error occurred.';
      setErrorMessage(`Upload error: ${serverError}`);
      setUploadProgress(0);
      setFile(null);  // Clear the file selection on error
    }
  };

  /**
   * Handles the drag-over event for drag-and-drop functionality.
   * 
   * @param {React.DragEvent<HTMLDivElement>} e - The drag-over event.
   */
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  /**
   * Handles the drag-leave event for drag-and-drop functionality.
   */
  const handleDragLeave = () => {
    setIsDragging(false);
  };

  /**
   * Handles the file drop event for drag-and-drop functionality.
   * 
   * @param {React.DragEvent<HTMLDivElement>} e - The drop event.
   */
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);

    const droppedFile = e.dataTransfer.files[0];
    handleFileSelection(droppedFile);
  };

  // Reset the state when the component is closed (e.g., modal closed)
  useEffect(() => {
    if (onClose) {
      resetState();
    }
  }, [onClose, resetState]);

  return (
    <div 
      className={`file-upload-container ${isDragging ? 'dragging' : ''}`} 
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <h2 className="file-upload-heading">Upload CSV File</h2>

      <div className={`file-upload-box ${file ? 'file-selected' : ''} ${isDragging ? 'drag-hover' : ''}`}>
        {/* Hidden file input for manual file selection */}
        <input
          type="file"
          id="file-input"
          className="file-input"
          accept=".csv"
          onChange={handleFileChange}
        />

        {/* Label acts as the visible button and drop zone */}
        <label htmlFor="file-input" className="file-label">
          {file ? file.name : 'Drag & drop your CSV here or click to browse'}
        </label>

        {/* Upload button - enabled only when a file is selected and not currently uploading */}
        <button 
          className={`upload-button ${file ? '' : 'disabled'}`}
          onClick={handleUpload}
          disabled={!file || uploadProgress > 0}
        >
          Upload
        </button>

        {/* Error message display */}
        {isError && <div className="file-error">{errorMessage}</div>}
        {/* Upload progress display */}
        {uploadProgress > 0 && <div className="upload-progress">Progress: {uploadProgress}%</div>}
      </div>
    </div>
  );
}

export default EnhancedFileUpload;