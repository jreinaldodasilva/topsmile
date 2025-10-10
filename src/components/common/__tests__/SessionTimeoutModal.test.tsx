import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { SessionTimeoutModal } from '../SessionTimeoutModal';

describe('SessionTimeoutModal', () => {
    it('should not render when show is false', () => {
        const { container } = render(<SessionTimeoutModal show={false} onContinue={jest.fn()} onLogout={jest.fn()} />);
        expect(container.firstChild).toBeNull();
    });

    it('should render when show is true', () => {
        render(<SessionTimeoutModal show={true} onContinue={jest.fn()} onLogout={jest.fn()} />);
        expect(screen.getByText('Sessão Expirando')).toBeInTheDocument();
    });

    it('should call onContinue when continue button clicked', () => {
        const onContinue = jest.fn();
        render(<SessionTimeoutModal show={true} onContinue={onContinue} onLogout={jest.fn()} />);

        fireEvent.click(screen.getByText('Continuar Conectado'));
        expect(onContinue).toHaveBeenCalledTimes(1);
    });

    it('should call onLogout when logout button clicked', () => {
        const onLogout = jest.fn();
        render(<SessionTimeoutModal show={true} onContinue={jest.fn()} onLogout={onLogout} />);

        fireEvent.click(screen.getByText('Sair'));
        expect(onLogout).toHaveBeenCalledTimes(1);
    });

    it('should have proper accessibility attributes', () => {
        render(<SessionTimeoutModal show={true} onContinue={jest.fn()} onLogout={jest.fn()} />);

        const dialog = screen.getByRole('dialog');
        expect(dialog).toHaveAttribute('aria-modal', 'true');
        expect(dialog).toHaveAttribute('aria-labelledby', 'session-timeout-title');
    });
});
