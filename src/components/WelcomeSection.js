import React from 'react';
import './WelcomeSection.css';

function WelcomeSection() {
  return (
    <div className="welcome-section">
      <h1>Welcome</h1>
      <div className="upload-section">
        <label htmlFor="upload-file" className="upload-label">
          Upload File:
        </label>
        <button className="import-button">Import</button>
      </div>
    </div>
  );
}

export default WelcomeSection;
