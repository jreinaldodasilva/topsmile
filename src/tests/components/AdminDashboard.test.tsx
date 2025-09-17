import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import AdminDashboard from '../../components/Admin/Dashboard/Dashboard';
import { render } from '../utils/test-utils';

describe('AdminDashboard', () => {
  it('renders dashboard title', () => {
    render(<AdminDashboard />);
    expect(screen.getByText(/Dashboard/i)).toBeInTheDocument();
  });

  it('displays loading state initially', () => {
    render(<AdminDashboard />);
    expect(screen.getByText(/Carregando/i)).toBeInTheDocument();
  });

  it('renders stats cards after loading', async () => {
    render(<AdminDashboard />);

    await waitFor(() => {
      expect(screen.getByText(/Total de Pacientes/i)).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.getByText(/Consultas Hoje/i)).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.getByText(/Receita Mensal/i)).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.getByText(/Satisfação/i)).toBeInTheDocument();
    });
  });

  it('renders upcoming appointments section', async () => {
    render(<AdminDashboard />);

    await waitFor(() => {
      expect(screen.getByText(/Próximas Consultas/i)).toBeInTheDocument();
    });
  });

  it('renders recent patients section', async () => {
    render(<AdminDashboard />);

    await waitFor(() => {
      expect(screen.getByText(/Pacientes Recentes/i)).toBeInTheDocument();
    });
  });

  it('renders pending tasks section', async () => {
    render(<AdminDashboard />);

    await waitFor(() => {
      expect(screen.getByText(/Tarefas Pendentes/i)).toBeInTheDocument();
    });
  });

  it('renders quick actions section', async () => {
    render(<AdminDashboard />);

    await waitFor(() => {
      expect(screen.getByText(/Ações Rápidas/i)).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.getByText(/Novo Paciente/i)).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.getByText(/Agendar Consulta/i)).toBeInTheDocument();
    });
  });
});
