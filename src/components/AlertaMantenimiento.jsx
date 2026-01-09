import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const AlertaMantenimiento = () => {
  return (
    <div 
      className="alert alert-warning alert-dismissible fade show d-flex align-items-center" 
      role="alert"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 9999,
        margin: 0,
        borderRadius: 0,
        backgroundColor: '#ffc107',
        border: '2px solid #ff9800',
        borderBottom: '3px solid #ff9800',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        animation: 'slideDown 0.5s ease-out',
        padding: '12px 20px',
        minHeight: '80px'
      }}
    >
      <style>
        {`
          @keyframes slideDown {
            from {
              transform: translateY(-100%);
              opacity: 0;
            }
            to {
              transform: translateY(0);
              opacity: 1;
            }
          }
          @keyframes pulse {
            0%, 100% {
              opacity: 1;
            }
            50% {
              opacity: 0.7;
            }
          }
        `}
      </style>
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width="24" 
        height="24" 
        fill="currentColor" 
        className="bi bi-exclamation-triangle-fill me-3" 
        viewBox="0 0 16 16"
        style={{ 
          color: '#856404',
          animation: 'pulse 2s infinite'
        }}
      >
        <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
      </svg>
      <div className="flex-grow-1">
        <strong style={{ color: '#856404', fontSize: '1.1rem' }}>
          ⚠️ Sistema en Mantenimiento
        </strong>
        <div style={{ color: '#856404', fontSize: '0.95rem', marginTop: '4px' }}>
          El sistema requiere mantenimiento y es posible que algunas funcionalidades se detengan temporalmente. 
          Por favor, contacte con el desarrollador para más información.
        </div>
      </div>
    </div>
  );
};

export default AlertaMantenimiento;

