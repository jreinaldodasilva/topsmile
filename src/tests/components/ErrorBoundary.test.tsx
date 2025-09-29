import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ErrorBoundary from '../../components/ErrorBoundary/ErrorBoundary';

// Suppress console.error for this test
const originalError = console.error;
beforeAll(() => {
  console.error = jest.fn();
});
afterAll(() => {
  console.error = originalError;
});

const ThrowError = ({ shouldThrow }: { shouldThrow: boolean }) => {
  if (shouldThrow) {
    throw new Error('Test error');
  }
  return <div>No Error</div>;
};

describe('ErrorBoundary', () => {
  it('should catch component errors and show fallback UI', () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(screen.getByText(/Componente com erro/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /tentar novamente/i })).toBeInTheDocument();
  });

  it('should render children when no error occurs', () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={false} />
      </ErrorBoundary>
    );

    expect(screen.getByText('No Error')).toBeInTheDocument();
    expect(screen.queryByText(/algo deu errado/i)).not.toBeInTheDocument();
  });

  it('should reset error state when retry button is clicked', () => {
    const { rerender } = render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(screen.getByText(/Componente com erro/i)).toBeInTheDocument();

    // Rerender without error
    rerender(
      <ErrorBoundary>
        <ThrowError shouldThrow={false} />
      </ErrorBoundary>
    );

    // Click retry
    fireEvent.click(screen.getByRole('button', { name: /tentar novamente/i }));

    expect(screen.getByText('No Error')).toBeInTheDocument();
  });

  it('should show component-level error UI for component errors', () => {
    render(
      <ErrorBoundary level="component">
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(screen.getByText('Componente com erro')).toBeInTheDocument();
    expect(screen.getByText(/este componente encontrou um problema/i)).toBeInTheDocument();
  });

  it('should show page-level error UI for page errors', () => {
    render(
      <ErrorBoundary level="page">
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(screen.getByText(/ops! algo deu errado/i)).toBeInTheDocument();
    expect(screen.getByText(/desculpe, mas algo inesperado aconteceu/i)).toBeInTheDocument();
  });

  it('should display error ID when available', () => {
    render(
      <ErrorBoundary level="page">
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    // Error ID should be generated and displayed
    expect(screen.getByText(/id do erro:/i)).toBeInTheDocument();
  });

  it('should limit retry attempts', () => {
    const { rerender } = render(
      <ErrorBoundary level="component">
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    // First retry should be available
    expect(screen.getByRole('button', { name: /tentar novamente \(2 restantes\)/i })).toBeInTheDocument();

    // Click retry
    fireEvent.click(screen.getByRole('button', { name: /tentar novamente \(2 restantes\)/i }));

    // Should still show error but with 1 remaining
    expect(screen.getByRole('button', { name: /tentar novamente \(1 restantes\)/i })).toBeInTheDocument();

    // Click again
    fireEvent.click(screen.getByRole('button', { name: /tentar novamente \(1 restantes\)/i }));

    // Should still show error but with 0 remaining
    expect(screen.getByRole('button', { name: /tentar novamente \(0 restantes\)/i })).toBeInTheDocument();

    // Click again - should not retry anymore
    fireEvent.click(screen.getByRole('button', { name: /tentar novamente \(0 restantes\)/i }));

    // Button should still be there but no more retries
    expect(screen.getByRole('button', { name: /tentar novamente \(0 restantes\)/i })).toBeInTheDocument();
  });

  it('should call custom error handler when provided', () => {
    const mockOnError = jest.fn();

    render(
      <ErrorBoundary onError={mockOnError}>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(mockOnError).toHaveBeenCalledWith(
      expect.any(Error),
      expect.objectContaining({
        componentStack: expect.any(String)
      })
    );
  });

  it('should include context in error logging', () => {
    const consoleSpy = jest.spyOn(console, 'group').mockImplementation(() => {});
    const consoleGroupEndSpy = jest.spyOn(console, 'groupEnd').mockImplementation(() => {});

    render(
      <ErrorBoundary context="TestComponent">
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('ErrorBoundary caught error'));
    expect(consoleGroupEndSpy).toHaveBeenCalled();

    consoleSpy.mockRestore();
    consoleGroupEndSpy.mockRestore();
  });

  it('should render custom fallback when provided', () => {
    const customFallback = <div>Custom Error Fallback</div>;

    render(
      <ErrorBoundary fallback={customFallback}>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(screen.getByText('Custom Error Fallback')).toBeInTheDocument();
    expect(screen.queryByText(/algo deu errado/i)).not.toBeInTheDocument();
  });

  it('should handle reload action', () => {
    const reloadSpy = jest.spyOn(window.location, 'reload').mockImplementation(() => {});

    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    fireEvent.click(screen.getByRole('button', { name: /recarregar página/i }));

    expect(reloadSpy).toHaveBeenCalled();

    reloadSpy.mockRestore();
  });

  it('should handle go home action for page-level errors', () => {
    const hrefSpy = jest.spyOn(window.location, 'href', 'set');

    render(
      <ErrorBoundary level="page">
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    fireEvent.click(screen.getByRole('button', { name: /ir para início/i }));

    expect(hrefSpy).toHaveBeenCalledWith('/');

    hrefSpy.mockRestore();
  });

  it('should copy error details to clipboard', async () => {
    const clipboardSpy = jest.spyOn(navigator.clipboard, 'writeText').mockResolvedValue();

    render(
      <ErrorBoundary level="page">
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    fireEvent.click(screen.getByRole('button', { name: /copiar detalhes do erro/i }));

    await waitFor(() => {
      expect(clipboardSpy).toHaveBeenCalledWith(
        expect.stringContaining('"errorId":')
      );
    });

    clipboardSpy.mockRestore();
  });

  it('should show development details in development mode', () => {
    const originalEnv = process.env.NODE_ENV;
    Object.defineProperty(process.env, 'NODE_ENV', {
      value: 'development',
      writable: true
    });

    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(screen.getByText('Detalhes do Erro (Desenvolvimento)')).toBeInTheDocument();

    Object.defineProperty(process.env, 'NODE_ENV', {
      value: originalEnv,
      writable: true
    });
  });

  it('should not show development details in production', () => {
    const originalEnv = process.env.NODE_ENV;
    Object.defineProperty(process.env, 'NODE_ENV', {
      value: 'production',
      writable: true
    });

    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(screen.queryByText('Detalhes do Erro (Desenvolvimento)')).not.toBeInTheDocument();

    Object.defineProperty(process.env, 'NODE_ENV', {
      value: originalEnv,
      writable: true
    });
  });
});
