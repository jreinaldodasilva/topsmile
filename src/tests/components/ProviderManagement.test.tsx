import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import ProviderManagement from '../../pages/Admin/ProviderManagement';
import { render } from '../utils/test-utils';

describe('ProviderManagement', () => {
    it('renders provider management title', () => {
        render(<ProviderManagement />);
        expect(screen.getByText(/Gestão de Profissionais/i)).toBeInTheDocument();
    });

    it('displays loading state initially', () => {
        render(<ProviderManagement />);
        expect(screen.getByText(/Carregando profissionais.../i)).toBeInTheDocument();
    });

    it('renders provider list after loading', async () => {
        render(<ProviderManagement />);

        await waitFor(() => {
            expect(screen.getByText(/Nenhum profissional encontrado/i)).toBeInTheDocument();
        });
    });

    it('renders add provider button', async () => {
        render(<ProviderManagement />);

        await waitFor(() => {
            expect(screen.getByRole('button', { name: /Novo Profissional/i })).toBeInTheDocument();
        });
    });
});
