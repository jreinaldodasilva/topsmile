import React from 'react';
import { screen, waitFor, fireEvent } from '@testing-library/react';
import PatientAppointmentDetail from '../../../../pages/Patient/Appointment/PatientAppointmentDetail';
import { apiService } from '../../../../services/apiService';
import { PatientAuthContext } from '../../../../contexts/PatientAuthContext';
import { render } from '../../../utils/test-utils';
import type { Provider, Clinic, Appointment } from '@topsmile/types';

// Mocks
jest.mock('../../../../services/apiService');
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
  useParams: () => ({ id: 'appt1' }),
}));

interface PatientUser {
  _id: string;
  patient: { _id: string; name: string; phone: string };
  email: string;
  isActive: boolean;
  emailVerified: boolean;
}

const mockPatientUser: PatientUser = { 
  _id: 'user1',
  patient: { _id: 'patient1', name: 'John Doe', phone: '123456789' },
  email: 'john@example.com',
  isActive: true,
  emailVerified: true
};

const mockAppointment: Appointment = {
  _id: 'appt1',
  scheduledStart: '2099-10-27T10:00:00.000Z',
  scheduledEnd: '2099-10-27T10:30:00.000Z',
  status: 'confirmed',
  priority: 'routine',
  preferredContactMethod: 'phone',
  syncStatus: 'synced',
  patient: 'patient1',
  provider: { name: 'Smith', specialties: ['Ortodontia'] },
  appointmentType: { name: 'Check-up', description: 'Routine', duration: 30, allowOnlineBooking: true },
  notes: 'Annual check-up',
  clinic: { name: 'Test Clinic', address: { street: 'Rua A', number: '123', city: 'SP', state: 'SP' } },
  createdAt: '2023-01-01T10:00:00.000Z',
};

function renderWithAuth(
  ui: React.ReactElement,
  { isAuthenticated = true, patientUser = mockPatientUser }: { isAuthenticated?: boolean; patientUser?: PatientUser | null } = {}
) {
  return render(
    <PatientAuthContext.Provider value={{ isAuthenticated, patientUser } as any}>
      {ui}
    </PatientAuthContext.Provider>
  );
}

describe('PatientAppointmentDetail', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (apiService.appointments.getOne as jest.Mock).mockResolvedValue({ success: true, data: mockAppointment });
  });

  it('redirects to login if not authenticated', async () => {
    renderWithAuth(<PatientAppointmentDetail />, { isAuthenticated: false });
    await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith('/patient/login'));
  });

  it('shows loading spinner when patientUser is not loaded', () => {
    renderWithAuth(<PatientAppointmentDetail />, { patientUser: null });
    expect(screen.getByText('Carregando...')).toBeInTheDocument();
  });

  it('shows loading state initially', () => {
    renderWithAuth(<PatientAppointmentDetail />);
    expect(screen.getByText('Carregando consulta...')).toBeInTheDocument();
  });

  it('loads and displays appointment details', async () => {
    renderWithAuth(<PatientAppointmentDetail />);
    await waitFor(() => {
      expect(screen.getByText('Check-up')).toBeInTheDocument();
      expect(screen.getByText('Dr. Smith')).toBeInTheDocument();
      expect(screen.getByText('Test Clinic')).toBeInTheDocument();
      expect(screen.getByText('Annual check-up')).toBeInTheDocument();
      expect(screen.getByText('Confirmada')).toBeInTheDocument();
      expect(screen.getByText('Ortodontia')).toBeInTheDocument();
      expect(screen.getByText('Routine')).toBeInTheDocument();
      expect(screen.getByText('30 minutos')).toBeInTheDocument();
      expect(screen.getByText('Data de Criação:')).toBeInTheDocument();
    });
  });

  it('shows error message if loading fails', async () => {
    (apiService.appointments.getOne as jest.Mock).mockResolvedValue({ success: false, message: 'Failed to load' });
    renderWithAuth(<PatientAppointmentDetail />);
    await waitFor(() => {
      expect(screen.getByText('Consulta não encontrada')).toBeInTheDocument();
      expect(screen.getByText('Tentar novamente')).toBeInTheDocument();
    });
  });

  it('shows error message if fetch throws', async () => {
    (apiService.appointments.getOne as jest.Mock).mockRejectedValue(new Error('Network error'));
    renderWithAuth(<PatientAppointmentDetail />);
    await waitFor(() => {
      expect(screen.getByText('Erro ao carregar consulta')).toBeInTheDocument();
    });
  });

  it('retries loading when clicking retry button', async () => {
    (apiService.appointments.getOne as jest.Mock).mockResolvedValueOnce({ success: false })
      .mockResolvedValueOnce({ success: true, data: mockAppointment });
    renderWithAuth(<PatientAppointmentDetail />);
    await waitFor(() => expect(screen.getByText('Consulta não encontrada')).toBeInTheDocument());
    fireEvent.click(screen.getByText('Tentar novamente'));
    await waitFor(() => expect(screen.getByText('Check-up')).toBeInTheDocument());
  });

  it('shows reschedule and cancel buttons for upcoming appointment', async () => {
    renderWithAuth(<PatientAppointmentDetail />);
    await waitFor(() => {
      expect(screen.getByText('Reagendar')).toBeInTheDocument();
      expect(screen.getByText('Cancelar Consulta')).toBeInTheDocument();
    });
  });

  it('calls navigate with reschedule data when Reagendar is clicked', async () => {
    renderWithAuth(<PatientAppointmentDetail />);
    await waitFor(() => expect(screen.getByText('Reagendar')).toBeInTheDocument());
    fireEvent.click(screen.getByText('Reagendar'));
    expect(mockNavigate).toHaveBeenCalledWith('/patient/appointments/new', expect.objectContaining({
      state: { rescheduleAppointment: expect.objectContaining({ _id: 'appt1' }) }
    }));
  });

  it('cancels appointment when Cancelar Consulta is clicked', async () => {
    (apiService.appointments.update as jest.Mock).mockResolvedValue({ success: true });
    renderWithAuth(<PatientAppointmentDetail />);
    await waitFor(() => expect(screen.getByText('Cancelar Consulta')).toBeInTheDocument());
    // @ts-ignore
    window.confirm = jest.fn(() => true);
    fireEvent.click(screen.getByText('Cancelar Consulta'));
    await waitFor(() => expect(apiService.appointments.update).toHaveBeenCalledWith('appt1', { status: 'cancelled' }));
    await waitFor(() => expect(screen.getByText('Cancelada')).toBeInTheDocument());
  });

  it('does not cancel appointment if user cancels confirm dialog', async () => {
    renderWithAuth(<PatientAppointmentDetail />);
    await waitFor(() => expect(screen.getByText('Cancelar Consulta')).toBeInTheDocument());
    // @ts-ignore
    window.confirm = jest.fn(() => false);
    fireEvent.click(screen.getByText('Cancelar Consulta'));
    expect(apiService.appointments.update).not.toHaveBeenCalled();
  });

  it('shows alert if cancellation fails', async () => {
    (apiService.appointments.update as jest.Mock).mockResolvedValue({ success: false });
    renderWithAuth(<PatientAppointmentDetail />);
    await waitFor(() => expect(screen.getByText('Cancelar Consulta')).toBeInTheDocument());
    // @ts-ignore
    window.confirm = jest.fn(() => true);
    // @ts-ignore
    window.alert = jest.fn();
    fireEvent.click(screen.getByText('Cancelar Consulta'));
    await waitFor(() => expect(window.alert).toHaveBeenCalledWith('Erro ao cancelar consulta'));
  });

  it('does not show actions for cancelled appointment', async () => {
    (apiService.appointments.getOne as jest.Mock).mockResolvedValue({
      success: true,
      data: { ...mockAppointment, status: 'cancelled' }
    });
    renderWithAuth(<PatientAppointmentDetail />);
    await waitFor(() => expect(screen.getByText('Cancelada')).toBeInTheDocument());
    expect(screen.queryByText('Reagendar')).not.toBeInTheDocument();
    expect(screen.queryByText('Cancelar Consulta')).not.toBeInTheDocument();
  });

  it('handles missing specialties and address gracefully', async () => {
    (apiService.appointments.getOne as jest.Mock).mockResolvedValue({
      success: true,
      data: {
        ...mockAppointment,
        provider: { name: 'Smith', specialties: [] },
        clinic: { name: 'Test Clinic' }
      }
    });
    renderWithAuth(<PatientAppointmentDetail />);
    await waitFor(() => {
      expect(screen.getByText('Test Clinic')).toBeInTheDocument();
      expect(screen.queryByText('Ortodontia')).not.toBeInTheDocument();
    });
  });

  it('handles missing notes gracefully', async () => {
    (apiService.appointments.getOne as jest.Mock).mockResolvedValue({
      success: true,
      data: { ...mockAppointment, notes: undefined }
    });
    renderWithAuth(<PatientAppointmentDetail />);
    await waitFor(() => {
      expect(screen.queryByText('Observações')).not.toBeInTheDocument();
    });
  });

  it('shows correct status color for each status', async () => {
    const statuses = [
      { status: 'confirmed', text: 'Confirmada' },
      { status: 'scheduled', text: 'Agendada' },
      { status: 'completed', text: 'Concluída' },
      { status: 'cancelled', text: 'Cancelada' },
      { status: 'no_show', text: 'Faltou' }
    ];
    for (const { status, text } of statuses) {
      (apiService.appointments.getOne as jest.Mock).mockResolvedValue({
        success: true,
        data: { ...mockAppointment, status }
      });
      renderWithAuth(<PatientAppointmentDetail />);
      await waitFor(() => expect(screen.getByText(text)).toBeInTheDocument());
    }
  });
});
