/**
 * WelcomeSection Component
 * 
 * This component renders a welcome message and an upload section that allows users 
 * to open a modal for file uploads. It manages the state for modal visibility 
 * and facilitates the data upload process through the EnhancedFileUpload component.
 * 
 * Props:
 * - setTableData (function): A function to update the parent component's state 
 *   with new data uploaded through the file upload modal.
 * 
 * Related components: Modal, EnhancedFileUpload
 * 
 * Example usage:
 * <WelcomeSection setTableData={appendTableData} />
 */

import React, { useState } from 'react';
import Modal from './Modal';
import EnhancedFileUpload from './EnhancedFileUpload';
import './WelcomeSection.css';

/**
 * WelcomeSection component: Handles the rendering of a welcome message, an upload button,
 * and a modal for file uploads. It manages the state for modal visibility and facilitates 
 * the file upload process.
 * 
 * @param {Object} props - The properties passed to the component.
 * @param {function} props.setTableData - Callback function to update table data in the parent component.
 * 
 * @returns {JSX.Element} - The rendered WelcomeSection component.
 */
function WelcomeSection({ setTableData }) {
  // State to manage modal visibility
  const [open, setOpen] = useState(false);

  return (
    <div className="welcome-section">
      {/* Heading for the welcome section */}
      <h1 className="welcome-heading">Welcome</h1>

      {/* Section for file upload button */}
      <div className="upload-section">
        <label htmlFor="upload-file" className="upload-label">
          <b>Upload File:</b>
        </label>

        {/* Button to open the modal for file upload */}
        <button className="import-button" onClick={() => setOpen(true)}>
          Import
        </button>
      </div>

      {/* Modal component containing the EnhancedFileUpload for file upload functionality */}
      <Modal open={open} onClose={() => setOpen(false)}>
        <EnhancedFileUpload setTableData={setTableData} />
      </Modal>
    </div>
  );
}

export default WelcomeSection;
