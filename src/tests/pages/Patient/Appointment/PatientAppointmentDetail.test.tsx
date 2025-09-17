import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import PatientAppointmentDetail from '../../../../pages/Patient/Appointment/PatientAppointmentDetail';
import { apiService } from '../../../../services/apiService';
import { render } from '../../../utils/test-utils';

// Mocks
jest.mock('../../../../services/apiService');
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
  useParams: () => ({ appointmentId: 'appt1' }),
}));

const mockAppointment = {
  _id: 'appt1',
  scheduledStart: '2023-10-27T10:00:00.000Z',
  status: 'Confirmed',
  provider: { name: 'Dr. Smith' },
  appointmentType: { name: 'Check-up' },
  notes: 'Annual check-up',
  clinic: { name: 'Test Clinic' },
};

describe('PatientAppointmentDetail', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (apiService.appointments.getOne as jest.Mock).mockResolvedValue({ success: true, data: mockAppointment });
  });

  it('redirects to login if not authenticated', async () => {
    render(<PatientAppointmentDetail />, { wrapperProps: { auth: { isAuthenticated: false } } });
    await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith('/patient/login'));
  });

  it('loads and displays appointment details', async () => {
    render(<PatientAppointmentDetail />, { wrapperProps: { auth: { isAuthenticated: true } } });
    await waitFor(() => {
      expect(screen.getByText('Check-up with Dr. Smith')).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.getByText('Confirmed')).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.getByText('Annual check-up')).toBeInTheDocument();
    });
  });

  it('shows loading state initially', () => {
    render(<PatientAppointmentDetail />, { wrapperProps: { auth: { isAuthenticated: true } } });
    expect(screen.getByText('Carregando...')).toBeInTheDocument();
  });

  it('shows error message if loading fails', async () => {
    (apiService.appointments.getOne as jest.Mock).mockResolvedValue({ success: false, message: 'Failed to load' });
    render(<PatientAppointmentDetail />, { wrapperProps: { auth: { isAuthenticated: true } } });
    await waitFor(() => {
      expect(screen.getByText('Erro ao carregar os detalhes da consulta')).toBeInTheDocument();
    });
  });
});
