import React from 'react';
import { render, screen } from '@testing-library/react';
import { ErrorProvider, useError } from '../../contexts/ErrorContext';

describe('ErrorContext', () => {
  const TestComponent = () => {
    const { notifications, showError, clearAllNotifications } = useError();

    return (
      <div>
        <div data-testid="notification-count">
          {notifications.length}
        </div>
        <button onClick={() => showError('Test Error', 'This is a test error')}>
          Show Error
        </button>
        <button onClick={() => clearAllNotifications()}>
          Clear All
        </button>
      </div>
    );
  };

  const setup = () => {
    render(
      <ErrorProvider>
        <TestComponent />
      </ErrorProvider>
    );
  };

  it('provides error context to children', () => {
    setup();
    expect(screen.getByTestId('notification-count')).toHaveTextContent('0');
  });

  it('renders show error and clear all buttons', () => {
    setup();
    expect(screen.getByRole('button', { name: /Show Error/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Clear All/i })).toBeInTheDocument();
  });

  it('allows showing and clearing error notifications', () => {
    setup();

    const showErrorButton = screen.getByRole('button', { name: /Show Error/i });
    showErrorButton.click();

    expect(screen.getByTestId('notification-count')).toHaveTextContent('1');

    const clearAllButton = screen.getByRole('button', { name: /Clear All/i });
    clearAllButton.click();

    expect(screen.getByTestId('notification-count')).toHaveTextContent('0');
  });
});
