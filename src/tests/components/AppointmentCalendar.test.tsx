import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import AppointmentCalendar from '../../pages/Admin/AppointmentCalendar';
import { AuthProvider } from '../../contexts/AuthContext';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

describe('AppointmentCalendar', () => {
  const queryClient = new QueryClient();
  const setup = () => {
    render(
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <AuthProvider>
            <AppointmentCalendar />
          </AuthProvider>
        </BrowserRouter>
      </QueryClientProvider>
    );
  };

  it('renders calendar header', () => {
    setup();
    expect(screen.getByText(/Calendário de Consultas/i)).toBeInTheDocument();
  });

  it('displays loading state initially', () => {
    setup();
    expect(screen.getByText(/Carregando/i)).toBeInTheDocument();
  });

  it('renders calendar grid after loading', async () => {
    setup();

    await waitFor(() => {
      expect(screen.getByRole('grid')).toBeInTheDocument();
    });
  });
});
