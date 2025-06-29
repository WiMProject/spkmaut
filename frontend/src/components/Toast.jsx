import { useState, useEffect } from 'react';

const Toast = ({ message, type = 'success', isVisible, onClose }) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  const typeStyles = {
    success: 'bg-green-500 text-white',
    error: 'bg-red-500 text-white',
    info: 'bg-blue-500 text-white'
  };

  const icons = {
    success: '✅',
    error: '❌', 
    info: 'ℹ️'
  };

  return (
    <div className="fixed top-4 right-4 z-50 animate-slideDown">
      <div className={`${typeStyles[type]} px-6 py-3 rounded-lg shadow-lg flex items-center space-x-2`}>
        <span>{icons[type]}</span>
        <span>{message}</span>
        <button onClick={onClose} className="ml-2 text-white hover:text-gray-200">
          ×
        </button>
      </div>
    </div>
  );
};

export default Toast;