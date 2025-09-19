import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import AdminDashboard from '../../components/Admin/Dashboard/Dashboard';
import { render } from '../utils/test-utils';

describe('AdminDashboard', () => {
  it('renders dashboard title', async () => {
    render(<AdminDashboard />);
    await waitFor(() => {
      expect(screen.getByText(/Dashboard/i)).toBeInTheDocument();
    });
  });

  it('displays loading state initially', () => {
    const { container } = render(<AdminDashboard />);
    expect(container.querySelector('.dashboard__loading')).toBeInTheDocument();
  });

  it('renders stats cards after loading', async () => {
    render(<AdminDashboard />);

    await waitFor(() => {
      expect(screen.getAllByText(/Total de Contatos/i).length).toBeGreaterThan(0);
    });
    await waitFor(() => {
      expect(screen.getAllByText(/Novos Esta Semana/i).length).toBeGreaterThan(0);
    });
    await waitFor(() => {
      expect(screen.getAllByText(/Taxa de Conversão/i).length).toBeGreaterThan(0);
    });
    await waitFor(() => {
      expect(screen.getAllByText(/Receita/i).length).toBeGreaterThan(0);
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
