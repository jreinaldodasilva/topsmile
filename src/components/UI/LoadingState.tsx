import React from 'react';

export const LoadingSpinner: React.FC = () => (
  <div className="loading-spinner">
    <div className="spinner"></div>
  </div>
);

export const LoadingOverlay: React.FC<{ message?: string }> = ({ message = 'Carregando...' }) => (
  <div className="loading-overlay">
    <LoadingSpinner />
    <p>{message}</p>
  </div>
);

export const LoadingButton: React.FC<{ loading: boolean; children: React.ReactNode; onClick?: () => void }> = ({ 
  loading, 
  children, 
  onClick 
}) => (
  <button onClick={onClick} disabled={loading}>
    {loading ? <LoadingSpinner /> : children}
  </button>
);
