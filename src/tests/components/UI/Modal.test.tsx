import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Modal from '../../../components/UI/Modal/Modal';

describe('Modal Component', () => {
    const mockOnClose = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('Rendering', () => {
        it('should render modal when open', () => {
            render(
                <Modal isOpen={true} onClose={mockOnClose} title="Test Modal">
                    <p>Modal content</p>
                </Modal>
            );

            expect(screen.getByText('Test Modal')).toBeInTheDocument();
            expect(screen.getByText('Modal content')).toBeInTheDocument();
        });

        it('should not render modal when closed', () => {
            render(
                <Modal isOpen={false} onClose={mockOnClose} title="Test Modal">
                    <p>Modal content</p>
                </Modal>
            );

            expect(screen.queryByText('Test Modal')).not.toBeInTheDocument();
            expect(screen.queryByText('Modal content')).not.toBeInTheDocument();
        });

        it('should render close button', () => {
            render(
                <Modal isOpen={true} onClose={mockOnClose} title="Test Modal">
                    <p>Modal content</p>
                </Modal>
            );

            expect(screen.getByRole('button', { name: /close/i })).toBeInTheDocument();
        });
    });

    describe('Interaction', () => {
        it('should call onClose when close button is clicked', async () => {
            const user = userEvent.setup();

            render(
                <Modal isOpen={true} onClose={mockOnClose} title="Test Modal">
                    <p>Modal content</p>
                </Modal>
            );

            const closeButton = screen.getByRole('button', { name: /close/i });
            await user.click(closeButton);

            expect(mockOnClose).toHaveBeenCalledTimes(1);
        });

        it('should call onClose when overlay is clicked', async () => {
            const user = userEvent.setup();

            render(
                <Modal isOpen={true} onClose={mockOnClose} title="Test Modal">
                    <p>Modal content</p>
                </Modal>
            );

            const overlay = screen.getByTestId('modal-overlay');
            await user.click(overlay);

            expect(mockOnClose).toHaveBeenCalledTimes(1);
        });

        it('should not close when modal content is clicked', async () => {
            const user = userEvent.setup();

            render(
                <Modal isOpen={true} onClose={mockOnClose} title="Test Modal">
                    <p>Modal content</p>
                </Modal>
            );

            const content = screen.getByText('Modal content');
            await user.click(content);

            expect(mockOnClose).not.toHaveBeenCalled();
        });

        it('should close on Escape key press', async () => {
            const user = userEvent.setup();

            render(
                <Modal isOpen={true} onClose={mockOnClose} title="Test Modal">
                    <p>Modal content</p>
                </Modal>
            );

            await user.keyboard('{Escape}');

            expect(mockOnClose).toHaveBeenCalledTimes(1);
        });
    });

    describe('Accessibility', () => {
        it('should have proper ARIA attributes', () => {
            render(
                <Modal isOpen={true} onClose={mockOnClose} title="Test Modal">
                    <p>Modal content</p>
                </Modal>
            );

            const modal = screen.getByRole('dialog');
            expect(modal).toHaveAttribute('aria-modal', 'true');
            expect(modal).toHaveAttribute('aria-labelledby');
        });

        it('should trap focus within modal', () => {
            render(
                <Modal isOpen={true} onClose={mockOnClose} title="Test Modal">
                    <button>First button</button>
                    <button>Second button</button>
                </Modal>
            );

            const firstButton = screen.getByText('First button');

            // Focus should be trapped within modal
            expect(document.activeElement).toBe(firstButton);
        });

        it('should restore focus when closed', () => {
            const triggerButton = document.createElement('button');
            document.body.appendChild(triggerButton);
            triggerButton.focus();

            const { rerender } = render(
                <Modal isOpen={true} onClose={mockOnClose} title="Test Modal">
                    <p>Modal content</p>
                </Modal>
            );

            rerender(
                <Modal isOpen={false} onClose={mockOnClose} title="Test Modal">
                    <p>Modal content</p>
                </Modal>
            );

            expect(document.activeElement).toBe(triggerButton);
            document.body.removeChild(triggerButton);
        });
    });

    describe('Edge Cases', () => {
        it('should handle rapid open/close', () => {
            const { rerender } = render(
                <Modal isOpen={false} onClose={mockOnClose} title="Test Modal">
                    <p>Modal content</p>
                </Modal>
            );

            // Rapidly toggle
            rerender(
                <Modal isOpen={true} onClose={mockOnClose} title="Test Modal">
                    <p>Modal content</p>
                </Modal>
            );

            rerender(
                <Modal isOpen={false} onClose={mockOnClose} title="Test Modal">
                    <p>Modal content</p>
                </Modal>
            );

            expect(screen.queryByText('Test Modal')).not.toBeInTheDocument();
        });

        it('should handle empty content', () => {
            render(
                <Modal isOpen={true} onClose={mockOnClose} title="Empty Modal">
                    <div></div>
                </Modal>
            );

            expect(screen.getByText('Empty Modal')).toBeInTheDocument();
        });

        it('should prevent body scroll when open', () => {
            render(
                <Modal isOpen={true} onClose={mockOnClose} title="Test Modal">
                    <p>Modal content</p>
                </Modal>
            );

            expect(document.body.style.overflow).toBe('hidden');
        });

        it('should restore body scroll when closed', () => {
            const { rerender } = render(
                <Modal isOpen={true} onClose={mockOnClose} title="Test Modal">
                    <p>Modal content</p>
                </Modal>
            );

            rerender(
                <Modal isOpen={false} onClose={mockOnClose} title="Test Modal">
                    <p>Modal content</p>
                </Modal>
            );

            expect(document.body.style.overflow).toBe('');
        });
    });
});
