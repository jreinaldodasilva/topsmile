import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import AppointmentCalendar from '../../pages/Admin/AppointmentCalendar';
import { render } from '../utils/test-utils';

describe('AppointmentCalendar', () => {
  it('renders calendar header', () => {
    render(<AppointmentCalendar />);
    expect(screen.getByText(/Agenda de Consultas/i)).toBeInTheDocument();
  });

  it('displays loading state initially', () => {
    render(<AppointmentCalendar />);
    expect(screen.getByText(/Carregando agendamentos.../i)).toBeInTheDocument();
  });

  it('renders calendar grid after loading', async () => {
    render(<AppointmentCalendar />);

    await waitFor(() => {
      expect(screen.getByText(/Nenhuma consulta encontrada/i)).toBeInTheDocument();
    });
  });
});
