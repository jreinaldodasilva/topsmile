import React from 'react';
import { screen, waitFor, fireEvent } from '@testing-library/react';
import PatientAppointmentsList from '../../../../pages/Patient/Appointment/PatientAppointmentsList';
import { apiService } from '../../../../services/apiService';
import { PatientAuthContext } from '../../../../contexts/PatientAuthContext';
import { render } from '../../../utils/test-utils';

// Mocks
jest.mock('../../../../services/apiService');
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

interface PatientUser {
  _id: string;
  patient: { _id: string; name: string; phone: string };
  email: string;
  isActive: boolean;
  emailVerified: boolean;
}

interface Appointment {
  _id: string;
  scheduledStart: string;
  status: string;
  provider: { name: string };
  appointmentType: { name: string };
  clinic: { name: string };
}

const mockAppointments: Appointment[] = [
  { _id: 'appt1', scheduledStart: '2023-10-27T10:00:00.000Z', status: 'Confirmed', provider: { name: 'Dr. Smith' }, appointmentType: { name: 'Check-up' }, clinic: { name: 'Test Clinic' } },
  { _id: 'appt2', scheduledStart: '2023-11-15T14:00:00.000Z', status: 'Completed', provider: { name: 'Dr. Jones' }, appointmentType: { name: 'Cleaning' }, clinic: { name: 'Test Clinic' } },
];

const mockPatientUser: PatientUser = {
  _id: 'user1',
  patient: { _id: 'patient1', name: 'John Doe', phone: '123456789' },
  email: 'john@example.com',
  isActive: true,
  emailVerified: true,
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

describe('PatientAppointmentsList', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (apiService.appointments.getAll as jest.Mock).mockResolvedValue({ success: true, data: mockAppointments });
  });

  it('redirects to login if not authenticated', async () => {
    renderWithAuth(<PatientAppointmentsList />, { isAuthenticated: false });
    await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith('/patient/login'));
  });

  it('loads and displays appointments', async () => {
    renderWithAuth(<PatientAppointmentsList />);
    await waitFor(() => {
      expect(screen.getByText((content, element) => element?.textContent === 'Check-upDr. Dr. SmithTest Clinic')).toBeInTheDocument();
      expect(screen.getByText((content, element) => element?.textContent === 'CleaningDr. Dr. JonesTest Clinic')).toBeInTheDocument();
    });
  });

  it('shows loading state initially', () => {
    renderWithAuth(<PatientAppointmentsList />);
    expect(screen.getByText('Carregando agendamentos...')).toBeInTheDocument();
  });

  it('shows error message if loading fails', async () => {
    (apiService.appointments.getAll as jest.Mock).mockResolvedValue({ success: false, message: 'Failed to load' });
    renderWithAuth(<PatientAppointmentsList />);
    await waitFor(() => {
      expect(screen.getByText('Erro ao carregar agendamentos')).toBeInTheDocument();
    });
  });

  it('navigates to appointment detail on click', async () => {
    renderWithAuth(<PatientAppointmentsList />);
    await waitFor(() => {
      expect(screen.getByText((content, element) => element?.textContent === 'Check-upDr. Dr. SmithTest Clinic')).toBeInTheDocument();
    });
    const appointmentLink = screen.getByText((content, element) => element?.textContent === 'Check-upDr. Dr. SmithTest Clinic');
    const detailsButton = appointmentLink.parentElement.parentElement.querySelector('.view-btn');
    fireEvent.click(detailsButton);
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/patient/appointments/appt1');
    });
  });
});
