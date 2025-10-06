import React from 'react';

interface SessionTimeoutModalProps {
  show: boolean;
  onContinue: () => void;
  onLogout: () => void;
}

export const SessionTimeoutModal: React.FC<SessionTimeoutModalProps> = ({
  show,
  onContinue,
  onLogout
}) => {
  if (!show) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="session-timeout-title"
    >
      <div
        style={{
          backgroundColor: 'white',
          padding: '24px',
          borderRadius: '8px',
          maxWidth: '400px',
          width: '90%',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        }}
      >
        <h2 id="session-timeout-title" style={{ marginTop: 0, marginBottom: '16px' }}>
          Sessão Expirando
        </h2>
        <p style={{ marginBottom: '24px' }}>
          Sua sessão expirará em 2 minutos por inatividade. Deseja continuar conectado?
        </p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
          <button
            onClick={onLogout}
            style={{
              padding: '8px 16px',
              border: '1px solid #ccc',
              borderRadius: '4px',
              backgroundColor: 'white',
              cursor: 'pointer'
            }}
          >
            Sair
          </button>
          <button
            onClick={onContinue}
            style={{
              padding: '8px 16px',
              border: 'none',
              borderRadius: '4px',
              backgroundColor: '#007bff',
              color: 'white',
              cursor: 'pointer'
            }}
            autoFocus
          >
            Continuar Conectado
          </button>
        </div>
      </div>
    </div>
  );
};
