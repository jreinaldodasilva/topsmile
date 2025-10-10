// src/components/common/ErrorMessage/ErrorMessage.test.tsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ErrorMessage } from './ErrorMessage';

describe('ErrorMessage', () => {
    it('should not render when error is null', () => {
        const { container } = render(<ErrorMessage error={null} />);
        expect(container.firstChild).toBeNull();
    });

    it('should render string error message', () => {
        render(<ErrorMessage error="Test error message" />);
        expect(screen.getByText('Test error message')).toBeInTheDocument();
    });

    it('should render Error object message', () => {
        const error = new Error('Error object message');
        render(<ErrorMessage error={error} />);
        expect(screen.getByText('Error object message')).toBeInTheDocument();
    });

    it('should render with alert role', () => {
        render(<ErrorMessage error="Test error" />);
        expect(screen.getByRole('alert')).toBeInTheDocument();
    });

    it('should render retry button when onRetry provided', () => {
        const onRetry = jest.fn();
        render(<ErrorMessage error="Test error" onRetry={onRetry} />);

        expect(screen.getByText('Tentar novamente')).toBeInTheDocument();
    });

    it('should call onRetry when retry button clicked', () => {
        const onRetry = jest.fn();
        render(<ErrorMessage error="Test error" onRetry={onRetry} />);

        fireEvent.click(screen.getByText('Tentar novamente'));
        expect(onRetry).toHaveBeenCalledTimes(1);
    });

    it('should not render retry button when onRetry not provided', () => {
        render(<ErrorMessage error="Test error" />);
        expect(screen.queryByText('Tentar novamente')).not.toBeInTheDocument();
    });
});
