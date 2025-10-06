// src/components/common/ErrorMessage/ErrorMessage.tsx
import React from 'react';
import './ErrorMessage.css';

interface ErrorMessageProps {
  error: Error | string | null;
  onRetry?: () => void;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ error, onRetry }) => {
  if (!error) return null;

  const message = typeof error === 'string' ? error : error.message;

  return (
    <div className="error-message" role="alert">
      <div className="error-message__icon">⚠️</div>
      <div className="error-message__content">
        <p className="error-message__text">{message}</p>
        {onRetry && (
          <button onClick={onRetry} className="error-message__retry">
            Tentar novamente
          </button>
        )}
      </div>
    </div>
  );
};
