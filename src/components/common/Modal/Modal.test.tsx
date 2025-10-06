// src/components/common/Modal/Modal.test.tsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Modal from './Modal';

describe('Modal', () => {
  const onClose = jest.fn();

  beforeEach(() => {
    onClose.mockClear();
  });

  it('renders when isOpen is true', () => {
    render(
      <Modal isOpen={true} onClose={onClose} title="Test Modal">
        <p>Modal content</p>
      </Modal>
    );
    expect(screen.getByText('Test Modal')).toBeInTheDocument();
    expect(screen.getByText('Modal content')).toBeInTheDocument();
  });

  it('does not render when isOpen is false', () => {
    render(
      <Modal isOpen={false} onClose={onClose} title="Test Modal">
        <p>Modal content</p>
      </Modal>
    );
    expect(screen.queryByText('Test Modal')).not.toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', () => {
    render(
      <Modal isOpen={true} onClose={onClose} title="Test Modal">
        <p>Content</p>
      </Modal>
    );
    fireEvent.click(screen.getByLabelText('Close'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when Escape key is pressed', () => {
    render(
      <Modal isOpen={true} onClose={onClose} title="Test Modal">
        <p>Content</p>
      </Modal>
    );
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when overlay is clicked', () => {
    render(
      <Modal isOpen={true} onClose={onClose} title="Test Modal">
        <p>Content</p>
      </Modal>
    );
    fireEvent.click(screen.getByRole('dialog').parentElement!);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('does not close on overlay click when closeOnOverlayClick is false', () => {
    render(
      <Modal isOpen={true} onClose={onClose} title="Test Modal" closeOnOverlayClick={false}>
        <p>Content</p>
      </Modal>
    );
    fireEvent.click(screen.getByRole('dialog').parentElement!);
    expect(onClose).not.toHaveBeenCalled();
  });

  it('renders footer when provided', () => {
    render(
      <Modal isOpen={true} onClose={onClose} title="Test Modal" footer={<button>Action</button>}>
        <p>Content</p>
      </Modal>
    );
    expect(screen.getByText('Action')).toBeInTheDocument();
  });

  it('applies size classes', () => {
    const { rerender } = render(
      <Modal isOpen={true} onClose={onClose} size="sm">
        <p>Content</p>
      </Modal>
    );
    expect(screen.getByRole('dialog')).toHaveClass('modal--sm');

    rerender(
      <Modal isOpen={true} onClose={onClose} size="lg">
        <p>Content</p>
      </Modal>
    );
    expect(screen.getByRole('dialog')).toHaveClass('modal--lg');
  });
});
