import React from 'react';
import { CheckCircle2, AlertCircle, Info, Download, Trash2, LogIn, LogOut, X } from 'lucide-react';

export default function ToastNotification({ toast, onClose }) {
  if (!toast) return null;

  // toast can be string or object: { message, type: 'success' | 'info' | 'error' | 'download' | 'delete' }
  const message = typeof toast === 'string' ? toast : toast.message;
  const type = typeof toast === 'string' ? 'success' : (toast.type || 'success');

  const getIcon = () => {
    switch (type) {
      case 'download':
        return <Download size={18} className="toast-icon toast-icon-download" />;
      case 'delete':
        return <Trash2 size={18} className="toast-icon toast-icon-delete" />;
      case 'login':
        return <LogIn size={18} className="toast-icon toast-icon-login" />;
      case 'logout':
        return <LogOut size={18} className="toast-icon toast-icon-logout" />;
      case 'error':
        return <AlertCircle size={18} className="toast-icon toast-icon-error" />;
      case 'info':
        return <Info size={18} className="toast-icon toast-icon-info" />;
      case 'success':
      default:
        return <CheckCircle2 size={18} className="toast-icon toast-icon-success" />;
    }
  };

  return (
    <div className={`toast-notification-wrap toast-type-${type}`}>
      <div className="toast-notification-body">
        <div className="toast-icon-container">
          {getIcon()}
        </div>
        <div className="toast-text-content">
          <p className="toast-message">{message}</p>
        </div>
        {onClose && (
          <button className="toast-close-btn" onClick={onClose} title="Dismiss">
            <X size={15} />
          </button>
        )}
      </div>
      <div className="toast-progress-bar" />
    </div>
  );
}
