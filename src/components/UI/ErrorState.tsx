import React from 'react';

interface ErrorStateProps {
    message: string;
    onRetry?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({ message, onRetry }) => (
    <div className="error-state">
        <div className="error-icon">⚠️</div>
        <p className="error-message">{message}</p>
        {onRetry && (
            <button className="retry-button" onClick={onRetry}>
                Tentar novamente
            </button>
        )}
    </div>
);

export const ErrorBanner: React.FC<ErrorStateProps> = ({ message, onRetry }) => (
    <div className="error-banner" role="alert">
        <span>⚠️ {message}</span>
        {onRetry && <button onClick={onRetry}>Tentar novamente</button>}
    </div>
);
