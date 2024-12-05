import React, { ReactNode } from 'react';

interface AlertProps {
  variant: 'success' | 'danger' | 'warning' | 'info';
  icon: ReactNode;
  message: string;
  handleClose: () => void;
}

const CustomAlert = ({ variant, icon, message, handleClose }: AlertProps) => {
  return (
    <div className={`alert alert-${variant}`} 
    style={{
      position: 'fixed',
      top: 0,
      left: '50%',
      transform: 'translateX(-50%)',
      width: '100%',
      maxWidth: '600px',
      zIndex: 1000,
      marginTop: '10px'
    }}
    >
      <span className="alert-icon">{icon}</span>
      <span className="alert-message">{message}</span>
      <button className="alert-close" onClick={handleClose}>×</button>
    </div>
  );
};

export default CustomAlert;