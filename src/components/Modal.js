/**
 * Modal Component
 * 
 * This component renders a modal overlay that appears on top of the current UI.
 * It includes backdrop functionality to close the modal when clicking outside of it
 * and a close button within the modal. The component can display any children elements 
 * passed to it, making it reusable for various content.
 * 
 * Props:
 * - open (boolean): Controls whether the modal is visible or hidden.
 * - onClose (function): Callback function that triggers when the modal needs to be closed, 
 *   either through the backdrop click or the close button.
 * - children (ReactNode): The content to be rendered inside the modal, allowing flexibility 
 *   in its usage.
 * 
 * Example usage:
 * <Modal open={isOpen} onClose={handleClose}>
 *   <p>Modal Content</p>
 * </Modal>
 */

import React from 'react';
import './Modal.css';

/**
 * Modal component: Renders a modal overlay that is visible when the `open` prop is true.
 * The modal can be closed by clicking on the backdrop or the close button inside the modal.
 * It contains a flexible children prop to render any content within the modal.
 * 
 * @param {Object} props - The properties passed to the component.
 * @param {boolean} props.open - Determines if the modal is visible or not.
 * @param {function} props.onClose - Callback function to close the modal.
 * @param {React.ReactNode} props.children - Content to render inside the modal.
 * 
 * @returns {JSX.Element} - The rendered Modal component.
 */
export default function Modal({ open, onClose, children }) {
  return (
    <div
      onClick={onClose}  // Close the modal when clicking the backdrop
      className={`modal-backdrop ${open ? 'visible' : 'invisible'}`}  // Toggle visibility
    >
      <div
        onClick={(e) => e.stopPropagation()}  // Prevent closing when clicking inside the modal
        className={`modal-container ${open ? 'active' : ''}`}  // Toggle active state
      >
        {/* Close button inside the modal */}
        <button
          onClick={onClose}
          className="modal-close-icon"
        >
          &times;
        </button>

        {/* Render children elements inside the modal */}
        {children}
      </div>
    </div>
  );
}
