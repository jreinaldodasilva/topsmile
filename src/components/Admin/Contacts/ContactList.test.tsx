import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import ContactList from './ContactList';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { server } from '../../../setupTests';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

describe('ContactList', () => {
  it('should render a list of contacts', async () => {
    render(
      <TestWrapper>
        <ContactList />
      </TestWrapper>
    );

    // Wait for the contacts to load from MSW
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    }, { timeout: 5000 });

    await waitFor(() => {
      expect(screen.getByText('jane@example.com')).toBeInTheDocument();
    });
  });

  it('should render loading state initially', () => {
    render(
      <TestWrapper>
        <ContactList />
      </TestWrapper>
    );

    // Should show loading skeleton initially
    expect(screen.getAllByTestId(/skeleton/i).length).toBeGreaterThan(0);
  });

  it('should render create contact button', async () => {
    render(
      <TestWrapper>
        <ContactList />
      </TestWrapper>
    );

    // The button should be there immediately
    expect(screen.getByRole('button', { name: /criar contato/i })).toBeInTheDocument();
  });
});
