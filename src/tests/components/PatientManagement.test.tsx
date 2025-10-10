import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import PatientManagement from '../../pages/Admin/PatientManagement';
import { render } from '../utils/test-utils';

describe('PatientManagement', () => {
    it('renders patient management title', () => {
        render(<PatientManagement />);
        expect(screen.getByText(/Gerenciamento de Pacientes/i)).toBeInTheDocument();
    });

    it('displays loading state initially', () => {
        render(<PatientManagement />);
        expect(screen.getByText(/Carregando pacientes.../i)).toBeInTheDocument();
    });

    it('renders patient list after loading', async () => {
        render(<PatientManagement />);

        await waitFor(() => {
            expect(screen.getByText(/Nenhum paciente encontrado/i)).toBeInTheDocument();
        });
    });

    it('renders add patient button', async () => {
        render(<PatientManagement />);

        await waitFor(() => {
            expect(screen.getByRole('button', { name: /Novo Paciente/i })).toBeInTheDocument();
        });
    });
});
