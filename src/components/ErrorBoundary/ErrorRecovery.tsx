import React from 'react';
import './ErrorRecovery.css';

interface ErrorRecoveryProps {
    errorType: 'network' | 'unknown' | 'api' | 'auth';
    onRetry?: () => void;
    onGoHome?: () => void;
}

const errorDetails = {
    network: {
        icon: '🌐',
        title: 'Erro de Conexão',
        message: 'Não foi possível conectar ao servidor. Verifique sua conexão com a internet e tente novamente.'
    },
    auth: {
        icon: '🔒',
        title: 'Erro de Autenticação',
        message: 'Sua sessão expirou ou suas credenciais são inválidas. Por favor, faça login novamente.'
    },
    api: {
        icon: '⚙️',
        title: 'Erro no Servidor',
        message:
            'Ocorreu um problema em nossos servidores. Nossa equipe já foi notificada. Por favor, tente novamente mais tarde.'
    },
    unknown: {
        icon: '🤔',
        title: 'Ocorreu um Erro Inesperado',
        message: 'Algo deu errado, mas não sabemos exatamente o quê. Por favor, tente recarregar a página.'
    }
};

const ErrorRecovery: React.FC<ErrorRecoveryProps> = ({ errorType, onRetry, onGoHome }) => {
    const details = errorDetails[errorType] || errorDetails.unknown;

    const handleGoHome = () => {
        if (onGoHome) {
            onGoHome();
        } else {
            window.location.href = '/';
        }
    };

    return (
        <div className="error-recovery">
            <div className="error-recovery__icon">{details.icon}</div>
            <h2 className="error-recovery__title">{details.title}</h2>
            <p className="error-recovery__message">{details.message}</p>
            <div className="error-recovery__actions">
                {onRetry && (
                    <button onClick={onRetry} className="error-recovery__btn error-recovery__btn--primary">
                        Tentar Novamente
                    </button>
                )}
                <button onClick={handleGoHome} className="error-recovery__btn error-recovery__btn--secondary">
                    Ir para Início
                </button>
            </div>
        </div>
    );
};

export default ErrorRecovery;
