import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ErrorProvider, useError } from '../../contexts/ErrorContext';

// Test component to interact with the context
const TestComponent: React.FC = () => {
  const { notifications, addError, addWarning, clearNotifications } = useError() as any;

  return (
    <div>
      <div data-testid="notification-count">{notifications.length}</div>
      {notifications.map((notification: any) => (
        <div key={notification.id} data-testid={`notification-${notification.id}`}>
          <span data-testid="notification-title">{notification.title}</span>
          <span data-testid="notification-message">{notification.message}</span>
          <button onClick={() => notification.onDismiss && notification.onDismiss()}>
            Dismiss
          </button>
        </div>
      ))}
      <button onClick={() => addError('Error message')}>
        Add Error
      </button>
      <button onClick={() => addWarning('Warning message')}>
        Add Warning
      </button>
      <button onClick={clearNotifications}>
        Clear All
      </button>
    </div>
  );
};

describe('ErrorContext', () => {
  it('logs an error and shows a notification', async () => {
    render(
      <ErrorProvider>
        <TestComponent />
      </ErrorProvider>
    );

    const addErrorButton = screen.getByText('Add Error');
    fireEvent.click(addErrorButton);

    await waitFor(() => {
      expect(screen.getByTestId('notification-count')).toHaveTextContent('1');
    });

    // Check that we have exactly one notification container
    const notifications = screen.getAllByTestId(/^notification-notification-/);
    expect(notifications).toHaveLength(1);
  });

  it('clears all notifications', async () => {
    render(
      <ErrorProvider>
        <TestComponent />
      </ErrorProvider>
    );

    // Add two different types of notifications
    const addErrorButton = screen.getByText('Add Error');
    const addWarningButton = screen.getByText('Add Warning');
    fireEvent.click(addErrorButton);
    fireEvent.click(addWarningButton);

    await waitFor(() => {
      expect(screen.getByTestId('notification-count')).toHaveTextContent('2');
    });

    // Check that we have exactly two notification containers
    const notificationsBefore = screen.getAllByTestId(/^notification-notification-/);
    expect(notificationsBefore).toHaveLength(2);

    // Clear notifications
    const clearButton = screen.getByText('Clear All');
    fireEvent.click(clearButton);

    await waitFor(() => {
      expect(screen.getByTestId('notification-count')).toHaveTextContent('0');
    });

    // Check that notifications are cleared
    const notificationsAfter = screen.queryAllByTestId(/^notification-notification-/);
    expect(notificationsAfter).toHaveLength(0);
  });
});
