import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import AdminDashboard from '../../components/Admin/Dashboard/Dashboard';
import { render } from '../utils/test-utils';
import { server } from '../../setupTests';
import { http, HttpResponse } from 'msw';

// Mock AuthContext to provide user data
jest.mock('../../contexts/AuthContext', () => ({
  useAuth: () => ({
    user: { name: 'Test User', role: 'admin' },
    logout: jest.fn()
  })
}));

describe('AdminDashboard', () => {
  beforeEach(() => {
    // Set up authentication
    localStorage.setItem('topsmile_access_token', 'test-token');
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('renders dashboard title', async () => {
    render(<AdminDashboard />);
    
    await waitFor(() => {
      expect(screen.getByText(/Dashboard TopSmile/i)).toBeInTheDocument();
    }, { timeout: 3000 });
  });

  it('renders stats cards after loading', async () => {
    render(<AdminDashboard />);

    // Wait for API call to complete and stats to render
    await waitFor(() => {
      expect(screen.getByText(/Total de Contatos/i)).toBeInTheDocument();
    }, { timeout: 3000 });
    
    await waitFor(() => {
      expect(screen.getByText(/Novos esta Semana/i)).toBeInTheDocument();
    });
    
    await waitFor(() => {
      expect(screen.getByText(/Taxa de Conversão/i)).toBeInTheDocument();
    });
    
    await waitFor(() => {
      expect(screen.getByText(/Receita do Mês/i)).toBeInTheDocument();
    });
  });

  it('renders upcoming appointments section', async () => {
    render(<AdminDashboard />);

    await waitFor(() => {
      expect(screen.getByText(/Módulos do Sistema/i)).toBeInTheDocument();
    }, { timeout: 3000 });
  });

  it('renders recent patients section', async () => {
    render(<AdminDashboard />);

    await waitFor(() => {
      expect(screen.getByText(/Gestão de Pacientes/i)).toBeInTheDocument();
    }, { timeout: 3000 });
  });

  it('renders pending tasks section', async () => {
    render(<AdminDashboard />);

    await waitFor(() => {
      expect(screen.getByText(/Gestão de Profissionais/i)).toBeInTheDocument();
    }, { timeout: 3000 });
  });

  it('renders quick actions section', async () => {
    render(<AdminDashboard />);

    await waitFor(() => {
      expect(screen.getByText(/Ações Rápidas/i)).toBeInTheDocument();
    }, { timeout: 3000 });
  });

  it('handles loading state', () => {
    // Override the handler to delay response
    server.use(
      http.get('*/api/admin/dashboard', () => {
        return new Promise(() => {}); // Never resolves - keeps loading
      })
    );

    render(<AdminDashboard />);
    
    expect(screen.getByText(/Carregando dashboard/i)).toBeInTheDocument();
  });

  it('handles error state', async () => {
    // Override handler to return error
    server.use(
      http.get('*/api/admin/dashboard', () => {
        return HttpResponse.json(
          { success: false, message: 'Server error' },
          { status: 500 }
        );
      })
    );

    render(<AdminDashboard />);

    await waitFor(() => {
      expect(screen.getByText(/Erro ao carregar dashboard/i)).toBeInTheDocument();
    }, { timeout: 3000 });
  });
});
