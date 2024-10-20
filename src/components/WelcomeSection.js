import React, { useState } from 'react';
import Modal from './Modal';
import EnhancedFileUpload from './EnhancedFileUpload';
import './WelcomeSection.css';

function WelcomeSection({ setTableData }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="welcome-section">
      <h1 className="welcome-heading">Welcome</h1>
      <div className="upload-section">
        <label htmlFor="upload-file" className="upload-label">
          Upload File:
        </label>
        <button className="import-button" onClick={() => setOpen(true)}>
          Import
        </button>
      </div>

      <Modal open={open} onClose={() => setOpen(false)}>
        <EnhancedFileUpload setTableData={setTableData} /> {/* Pass setTableData prop */}
      </Modal>
    </div>
  );
}

export default WelcomeSection;
