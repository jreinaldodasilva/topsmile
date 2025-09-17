import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import ContactManagement from '../../pages/Admin/ContactManagement';
import { render } from '../utils/test-utils';

describe('ContactManagement', () => {
  it('renders contact management title', () => {
    render(<ContactManagement />);
    expect(screen.getByText(/Gerenciamento de Contatos/i)).toBeInTheDocument();
  });

  it('displays loading state initially', () => {
    render(<ContactManagement />);
    expect(screen.getByText(/Atualizando.../i)).toBeInTheDocument();
  });

  it('renders contact list after loading', async () => {
    render(<ContactManagement />);

    await waitFor(() => {
      expect(screen.getByText(/Gerenciar Contatos/i)).toBeInTheDocument();
    });
  });

  it('renders add contact button', async () => {
    render(<ContactManagement />);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Criar Contato/i })).toBeInTheDocument();
    });
  });
});
