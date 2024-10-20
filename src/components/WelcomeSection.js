import React, { useState } from 'react';
import Modal from './Modal';
import FileUpload from './FileUpload';  // Import FileUpload
import './WelcomeSection.css';

function WelcomeSection() {
  const [open, setOpen] = useState(false);

  return (
    <div className="welcome-section">
      <h1 className="welcome-heading">Welcome</h1>
      <div className="upload-section">
        <label htmlFor="upload-file" className="upload-label">
          Upload File:
        </label>
        <button
          className="import-button"
          onClick={() => setOpen(true)}
        >
          Import
        </button>
      </div>

      <Modal open={open} onClose={() => setOpen(false)}>
        <FileUpload />
      </Modal>
    </div>
  );
}

export default WelcomeSection;
