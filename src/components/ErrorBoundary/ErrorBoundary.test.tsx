// src/components/ErrorBoundary/ErrorBoundary.test.tsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ErrorBoundary from './ErrorBoundary';

const ThrowError = ({ shouldThrow }: { shouldThrow: boolean }) => {
    if (shouldThrow) {
        throw new Error('Test error');
    }
    return <div>No error</div>;
};

describe('ErrorBoundary', () => {
    const originalError = console.error;

    beforeAll(() => {
        console.error = jest.fn();
    });

    afterAll(() => {
        console.error = originalError;
    });

    it('should render children when no error', () => {
        render(
            <ErrorBoundary>
                <div>Test content</div>
            </ErrorBoundary>
        );

        expect(screen.getByText('Test content')).toBeInTheDocument();
    });

    it('should render component-level error UI', () => {
        render(
            <ErrorBoundary level="component">
                <ThrowError shouldThrow={true} />
            </ErrorBoundary>
        );

        expect(screen.getByText('Componente com erro')).toBeInTheDocument();
        expect(screen.getByText(/Este componente encontrou um problema/)).toBeInTheDocument();
    });

    it('should render page-level error UI', () => {
        render(
            <ErrorBoundary level="page">
                <ThrowError shouldThrow={true} />
            </ErrorBoundary>
        );

        expect(screen.getByText('Ops! Algo deu errado')).toBeInTheDocument();
        expect(screen.getByText(/ID do Erro:/)).toBeInTheDocument();
    });

    it('should render custom fallback', () => {
        render(
            <ErrorBoundary fallback={<div>Custom error UI</div>}>
                <ThrowError shouldThrow={true} />
            </ErrorBoundary>
        );

        expect(screen.getByText('Custom error UI')).toBeInTheDocument();
    });

    it('should call onError callback', () => {
        const onError = jest.fn();

        render(
            <ErrorBoundary onError={onError}>
                <ThrowError shouldThrow={true} />
            </ErrorBoundary>
        );

        expect(onError).toHaveBeenCalled();
    });

    it('should show retry button for component level', () => {
        render(
            <ErrorBoundary level="component">
                <ThrowError shouldThrow={true} />
            </ErrorBoundary>
        );

        expect(screen.getByText(/Tentar Novamente/)).toBeInTheDocument();
    });

    it('should show reload button', () => {
        const reloadMock = jest.fn();
        Object.defineProperty(window, 'location', {
            value: { reload: reloadMock },
            writable: true
        });

        render(
            <ErrorBoundary level="component">
                <ThrowError shouldThrow={true} />
            </ErrorBoundary>
        );

        const reloadButton = screen.getByText('Recarregar Página');
        fireEvent.click(reloadButton);

        expect(reloadMock).toHaveBeenCalled();
    });
});
