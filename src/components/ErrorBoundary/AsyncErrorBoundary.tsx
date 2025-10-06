// src/components/ErrorBoundary/AsyncErrorBoundary.tsx
import React, { Component, ReactNode } from 'react';
import ErrorBoundary from './ErrorBoundary';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  error: Error | null;
}

export class AsyncErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { error: null };
  }

  componentDidMount() {
    window.addEventListener('unhandledrejection', this.handlePromiseRejection);
  }

  componentWillUnmount() {
    window.removeEventListener('unhandledrejection', this.handlePromiseRejection);
  }

  handlePromiseRejection = (event: PromiseRejectionEvent) => {
    event.preventDefault();
    this.setState({ error: event.reason });
  };

  render() {
    if (this.state.error) {
      return (
        <ErrorBoundary level="page" context="async-error">
          {this.props.fallback || (
            <div style={{ padding: '2rem', textAlign: 'center' }}>
              <h2>Erro Assíncrono</h2>
              <p>{this.state.error.message}</p>
              <button onClick={() => window.location.reload()}>
                Recarregar
              </button>
            </div>
          )}
        </ErrorBoundary>
      );
    }

    return this.props.children;
  }
}
