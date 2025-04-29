import React from 'react';
import { X, AlertTriangle } from 'lucide-react';
import '../../styles/modal.css';

interface DeleteConfirmationProps {
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const DeleteConfirmation: React.FC<DeleteConfirmationProps> = ({
  title,
  message,
  onConfirm,
  onCancel
}) => {
  return (
    <div className="modal-overlay">
      <div className="modal modal-small scale-in">
        <div className="modal-header delete-header">
          <h2>{title}</h2>
          <button className="modal-close" onClick={onCancel}>
            <X size={18} />
          </button>
        </div>
        
        <div className="modal-content">
          <div className="delete-warning">
            <div className="warning-icon">
              <AlertTriangle size={24} />
            </div>
            <p>{message}</p>
          </div>
          
          <div className="modal-footer">
            <button 
              type="button" 
              className="btn btn-outline" 
              onClick={onCancel}
            >
              Cancel
            </button>
            <button 
              type="button" 
              className="btn btn-danger"
              onClick={onConfirm}
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmation;