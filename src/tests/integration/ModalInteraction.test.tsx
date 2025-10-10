// src/tests/integration/ModalInteraction.test.tsx
import React, { useState } from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Modal, Button } from '../../components/common';

const ModalExample = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [confirmed, setConfirmed] = useState(false);

    const handleConfirm = () => {
        setConfirmed(true);
        setIsOpen(false);
    };

    return (
        <div>
            <Button onClick={() => setIsOpen(true)}>Open Modal</Button>
            {confirmed && <div>Action Confirmed</div>}

            <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Confirm Action">
                <p>Are you sure?</p>
                <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                    <Button variant="secondary" onClick={() => setIsOpen(false)}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={handleConfirm}>
                        Confirm
                    </Button>
                </div>
            </Modal>
        </div>
    );
};

describe('Modal Interaction Integration', () => {
    it('opens modal, confirms action, and closes', () => {
        render(<ModalExample />);

        expect(screen.queryByText('Confirm Action')).not.toBeInTheDocument();

        fireEvent.click(screen.getByText('Open Modal'));

        expect(screen.getByText('Confirm Action')).toBeInTheDocument();
        expect(screen.getByText('Are you sure?')).toBeInTheDocument();

        fireEvent.click(screen.getByText('Confirm'));

        expect(screen.queryByText('Confirm Action')).not.toBeInTheDocument();
        expect(screen.getByText('Action Confirmed')).toBeInTheDocument();
    });

    it('cancels modal without confirming', () => {
        render(<ModalExample />);

        fireEvent.click(screen.getByText('Open Modal'));
        expect(screen.getByText('Confirm Action')).toBeInTheDocument();

        fireEvent.click(screen.getByText('Cancel'));

        expect(screen.queryByText('Confirm Action')).not.toBeInTheDocument();
        expect(screen.queryByText('Action Confirmed')).not.toBeInTheDocument();
    });
});
