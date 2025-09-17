import React from 'react';
import { screen, waitFor, fireEvent } from '@testing-library/react';
import PatientAppointmentsList from '../../../../pages/Patient/Appointment/PatientAppointmentsList';
import { apiService } from '../../../../services/apiService';
import { render } from '../../../utils/test-utils';

// Mocks
jest.mock('../../../../services/apiService');
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

const mockAppointments = [
  { _id: 'appt1', scheduledStart: '2023-10-27T10:00:00.000Z', status: 'Confirmed', provider: { name: 'Dr. Smith' }, appointmentType: { name: 'Check-up' }, clinic: { name: 'Test Clinic' } },
  { _id: 'appt2', scheduledStart: '2023-11-15T14:00:00.000Z', status: 'Completed', provider: { name: 'Dr. Jones' }, appointmentType: { name: 'Cleaning' }, clinic: { name: 'Test Clinic' } },
];

describe('PatientAppointmentsList', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (apiService.appointments.getAll as jest.Mock).mockResolvedValue({ success: true, data: mockAppointments });
  });

  it('redirects to login if not authenticated', async () => {
    render(<PatientAppointmentsList />, { wrapperProps: { auth: { isAuthenticated: false } } });
    await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith('/patient/login'));
  });

  it('loads and displays appointments', async () => {
    render(<PatientAppointmentsList />, { wrapperProps: { auth: { isAuthenticated: true, patientUser: { _id: 'user1', patient: { _id: 'patient1', name: 'John Doe', phone: '123456789' }, email: 'john@example.com', isActive: true, emailVerified: true } } } });
    await waitFor(() => {
      expect(screen.getByText('Check-up with Dr. Smith')).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.getByText('Cleaning with Dr. Jones')).toBeInTheDocument();
    });
  });

  it('shows loading state initially', () => {
    render(<PatientAppointmentsList />, { wrapperProps: { auth: { isAuthenticated: true, patientUser: { _id: 'user1', patient: { _id: 'patient1', name: 'John Doe', phone: '123456789' }, email: 'john@example.com', isActive: true, emailVerified: true } } } });
    expect(screen.getByText('Carregando agendamentos...')).toBeInTheDocument();
  });

  it('shows error message if loading fails', async () => {
    (apiService.appointments.getAll as jest.Mock).mockResolvedValue({ success: false, message: 'Failed to load' });
    render(<PatientAppointmentsList />, { wrapperProps: { auth: { isAuthenticated: true, patientUser: { _id: 'user1', patient: { _id: 'patient1', name: 'John Doe', phone: '123456789' }, email: 'john@example.com', isActive: true, emailVerified: true } } } });
    await waitFor(() => {
      expect(screen.getByText('Erro ao carregar agendamentos')).toBeInTheDocument();
    });
  });

  it('navigates to appointment detail on click', async () => {
    render(<PatientAppointmentsList />, { wrapperProps: { auth: { isAuthenticated: true, patientUser: { _id: 'user1', patient: { _id: 'patient1', name: 'John Doe', phone: '123456789' }, email: 'john@example.com', isActive: true, emailVerified: true } } } });
    await waitFor(() => {
      expect(screen.getByText('Check-up with Dr. Smith')).toBeInTheDocument();
    });
    const appointmentLink = screen.getByText('Check-up with Dr. Smith');
    fireEvent.click(appointmentLink);
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/patient/appointments/appt1');
    });
  });
});
