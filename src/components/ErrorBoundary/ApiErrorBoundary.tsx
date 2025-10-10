import React, { Component, ErrorInfo, ReactNode } from 'react';
import ErrorRecovery from './ErrorRecovery';
import logger from '../../utils/logger';
import './ApiErrorBoundary.css';

interface Props {
    children: ReactNode;
    onReset?: () => void;
}

interface State {
    hasError: boolean;
    errorType: 'network' | 'api' | 'auth' | 'unknown';
}

class ApiErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false, errorType: 'unknown' };
    }

    static getDerivedStateFromError(error: Error): State {
        logger.warn('[ApiErrorBoundary] Caught error:', error);
        if (
            error.message.toLowerCase().includes('network error') ||
            error.message.toLowerCase().includes('failed to fetch')
        ) {
            return { hasError: true, errorType: 'network' };
        }
        if ('status' in (error as any) && typeof (error as any).status === 'number') {
            if ((error as any).status === 401 || (error as any).status === 403) {
                return { hasError: true, errorType: 'auth' };
            }
            if ((error as any).status >= 500) {
                return { hasError: true, errorType: 'api' };
            }
        }

        return { hasError: true, errorType: 'unknown' };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        logger.error('[ApiErrorBoundary] componentDidCatch:', {
            error,
            componentStack: errorInfo.componentStack
        });
    }

    handleRetry = () => {
        this.props.onReset?.();
        this.setState({ hasError: false, errorType: 'unknown' });
    };

    render() {
        if (this.state.hasError) {
            return (
                <div className="api-error-boundary">
                    <ErrorRecovery errorType={this.state.errorType} onRetry={this.handleRetry} />
                </div>
            );
        }

        return this.props.children;
    }
}

export default ApiErrorBoundary;
