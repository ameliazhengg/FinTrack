import React from 'react';
import './Modal.css'; 

export default function Modal({ open, onClose, children }) {
  return (
    <div
      onClick={onClose}
      className={`modal-backdrop ${open ? 'visible' : 'invisible'}`}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`modal-container ${open ? 'active' : ''}`}
      >
        <button
          onClick={onClose}
          className="modal-close-icon"
        >
          &times;
        </button>
        {children}
      </div>
    </div>
  );
}
