import React from 'react';
import './Modal.css';

/**
 * Modal Component
 * 
 * This component renders a modal overlay that appears on top of the current UI.
 * It includes backdrop functionality to close the modal when clicking outside of it
 * and a close button within the modal. The component can display any children elements 
 * passed to it, making it reusable for various content.
 * 
 * Features:
 * - Conditional rendering based on 'open' prop
 * - Backdrop click to close
 * - Close button within the modal
 * - Flexible content through children prop
 * - Prevents event propagation for clicks inside the modal
 * - Console logging for debugging (backdrop and close button clicks)
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

/**
 * Modal component: Renders a modal overlay when the 'open' prop is true.
 * 
 * @param {Object} props - The properties passed to the component.
 * @param {boolean} props.open - Determines if the modal is visible.
 * @param {function} props.onClose - Callback function to close the modal.
 * @param {React.ReactNode} props.children - Content to render inside the modal.
 * 
 * @returns {JSX.Element|null} The rendered Modal component or null if not open.
 */
export default function Modal({ open, onClose, children }) {
  // Early return if the modal should not be displayed
  if (!open) return null;

  return (
    <div
      className="modal-backdrop visible"
      onClick={() => {
        console.log('Backdrop clicked'); // Debugging log
        onClose();  // Trigger the close function
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}  // Prevent closing when clicking inside the modal
        className="modal-container active"
      >
        {/* Close button inside the modal */}
        <button
          onClick={() => {
            console.log('Close button clicked'); // Debugging log
            onClose();  // Trigger the close function
          }}
          className="modal-close-icon"
        >
          &times;
        </button>

        {/* Render the children elements passed to the modal */}
        {children}
      </div>
    </div>
  );
}