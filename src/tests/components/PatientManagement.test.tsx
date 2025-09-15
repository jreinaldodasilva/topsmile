import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import PatientManagement from '../../pages/Admin/PatientManagement';
import { AuthProvider } from '../../contexts/AuthContext';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

describe('PatientManagement', () => {
  const queryClient = new QueryClient();
  const setup = () => {
    render(
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <AuthProvider>
            <PatientManagement />
          </AuthProvider>
        </BrowserRouter>
      </QueryClientProvider>
    );
  };

  it('renders patient management title', () => {
    setup();
    expect(screen.getByText(/Gerenciamento de Pacientes/i)).toBeInTheDocument();
  });

  it('displays loading state initially', () => {
    setup();
    expect(screen.getByText(/Carregando/i)).toBeInTheDocument();
  });

  it('renders patient list after loading', async () => {
    setup();

    await waitFor(() => {
      expect(screen.getByText(/Lista de Pacientes/i)).toBeInTheDocument();
    });
  });

  it('renders add patient button', async () => {
    setup();

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Adicionar Paciente/i })).toBeInTheDocument();
    });
  });
});
