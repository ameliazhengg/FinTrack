import React, { useState } from 'react';
import './FileUpload.css';

function FileUpload() {
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  return (
    <div className="file-upload-container">
      <h2 className="file-upload-heading">Step 1: Upload File</h2>
      <div className="file-upload-box">
        {file ? (
          <div className="file-info">
            <span className="file-name">{file.name}</span>
            <span className="file-size">
              {(file.size / 1024).toFixed(2)} KB
            </span>
          </div>
        ) : (
          <div className="file-dropzone">
            <label htmlFor="file-input" className="file-label">
              <span className="file-drop-text">Drop file here or</span>
              <span className="file-browse-text"> browse</span>
            </label>
            <input
              type="file"
              id="file-input"
              className="file-input"
              onChange={handleFileChange}
              hidden
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default FileUpload;
