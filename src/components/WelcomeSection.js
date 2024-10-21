/**
 * WelcomeSection Component
 * 
 * This component renders a welcome message and an upload section that allows users 
 * to open a modal for file uploads. It manages the state for modal visibility 
 * and facilitates the data upload process through the EnhancedFileUpload component.
 * 
 * Features:
 * - Displays a welcome heading
 * - Provides an "Import" button to open a file upload modal
 * - Manages modal visibility state
 * - Renders a Modal component with EnhancedFileUpload when open
 * - Handles modal closure and state reset
 * 
 * Props:
 * - setTableData (function): A function to update the parent component's state 
 *   with new data uploaded through the file upload modal.
 * 
 * Related components: Modal, EnhancedFileUpload
 * 
 * Example usage:
 * <WelcomeSection setTableData={updateParentData} />
 */

import React, { useState, useCallback } from 'react';
import Modal from './Modal';
import EnhancedFileUpload from './EnhancedFileUpload';
import './WelcomeSection.css';

/**
 * WelcomeSection component: Renders a welcome message, an upload button,
 * and a modal for file uploads. It manages the state for modal visibility 
 * and facilitates the file upload process.
 * 
 * @param {Object} props - The properties passed to the component.
 * @param {function} props.setTableData - Callback function to update table data in the parent component.
 * 
 * @returns {JSX.Element} The rendered WelcomeSection component.
 */
function WelcomeSection({ setTableData }) {
  // State to manage modal visibility
  const [isModalOpen, setModalOpen] = useState(false);

  /**
   * Handles opening the modal.
   */
  const handleOpenModal = () => {
    setModalOpen(true);
  };

  /**
   * Handles closing the modal and resetting the upload state.
   * This function is memoized to prevent unnecessary re-renders.
   */
  const handleCloseModal = useCallback(() => {
    console.log('Modal closed, resetting state'); // Debugging log
    setModalOpen(false);
  }, []);

  return (
    <div className="welcome-section">
      {/* Welcome heading */}
      <h1 className="welcome-heading">Welcome</h1>
      
      {/* Upload section with import button */}
      <div className="upload-section">
        <label htmlFor="upload-file" className="upload-label">
          <b>Upload File:</b>
        </label>
        <button className="import-button" onClick={handleOpenModal}>
          Import
        </button>
      </div>

      {/* Conditional rendering of Modal component */}
      {isModalOpen && (
        <Modal open={isModalOpen} onClose={handleCloseModal}>
          <EnhancedFileUpload setTableData={setTableData} onClose={handleCloseModal} />
        </Modal>
      )}
    </div>
  );
}

export default WelcomeSection;