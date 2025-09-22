import React from 'react';
import { screen, waitFor, fireEvent } from '@testing-library/react';
import PatientDashboard from '../../../../pages/Patient/Dashboard/PatientDashboard';
import { apiService } from '../../../../services/apiService';
import { PatientAuthContext } from '../../../../contexts/PatientAuthContext';
import { render } from '../../../utils/test-utils';
import type { Patient, Provider, Clinic } from '@topsmile/types';


// Mocks
jest.mock('../../../../services/apiService');
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

const mockPatientUser = {
  _id: 'user1',
  patient: { _id: 'patient1', name: 'John Doe', phone: '123456789' },
  email: 'john@example.com',
  isActive: true,
  emailVerified: true
};

const mockPatientUserWithMedicalHistory = {
  ...mockPatientUser,
  patient: {
    ...mockPatientUser.patient,
    medicalHistory: {
      allergies: ['Penicillin'],
      medications: ['Ibuprofen'],
      conditions: ['Diabetes']
    }
  }
};

const mockAppointments = [
  {
    _id: 'appt1',
    scheduledStart: '2099-10-27T10:00:00.000Z',
    scheduledEnd: '2099-10-27T11:00:00.000Z',
    status: 'confirmed',
    appointmentType: { name: 'Check-up' },
    provider: { name: 'Smith' },
    clinic: { name: 'Smile Clinic' }
  },
  {
    _id: 'appt2',
    scheduledStart: '2022-10-27T10:00:00.000Z',
    scheduledEnd: '2022-10-27T11:00:00.000Z',
    status: 'completed',
    appointmentType: { name: 'Cleaning' },
    provider: { name: 'Jones' },
    clinic: { name: 'Smile Clinic' }
  }
];

function renderWithAuth(
  ui: React.ReactElement,
  { isAuthenticated = true, patientUser = mockPatientUser }: { isAuthenticated?: boolean; patientUser?: any } = {}
) {
  return render(
    <PatientAuthContext.Provider value={{ isAuthenticated, patientUser } as any}>
      {ui}
    </PatientAuthContext.Provider>
  );
}

describe('PatientDashboard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (apiService.appointments.getAll as jest.Mock).mockResolvedValue({ success: true, data: mockAppointments });
  });

  it('redirects to login if not authenticated', async () => {
    renderWithAuth(<PatientDashboard />, { isAuthenticated: false });
    await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith('/patient/login'));
  });

  it('shows loading spinner when patientUser is not loaded', () => {
    renderWithAuth(<PatientDashboard />, { patientUser: null });
    expect(screen.getByText('Carregando...')).toBeInTheDocument();
  });

  it('loads and displays dashboard data', async () => {
    renderWithAuth(<PatientDashboard />);
    await waitFor(() => {
      expect(screen.getByText('Olá, John!')).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.getByText('Check-up')).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.getByText('Dr. Smith')).toBeInTheDocument();
    });
  });

  it('shows error message if loading fails', async () => {
    (apiService.appointments.getAll as jest.Mock).mockResolvedValue({ success: false, message: 'Erro ao carregar agendamentos' });
    renderWithAuth(<PatientDashboard />);
    await waitFor(() => {
      expect(screen.getByText('Nenhum agendamento encontrado')).toBeInTheDocument();
    });
  });

  it('shows empty state when there are no upcoming appointments', async () => {
    (apiService.appointments.getAll as jest.Mock).mockResolvedValue({ success: true, data: [] });
    renderWithAuth(<PatientDashboard />);
    await waitFor(() => {
      expect(screen.getByText('Nenhum agendamento encontrado')).toBeInTheDocument();
      expect(screen.getByText('Você não tem agendamentos próximos.')).toBeInTheDocument();
    });
  });

  it('navigates to new appointment when "Agendar Consulta" button is clicked', async () => {
    renderWithAuth(<PatientDashboard />);
    await waitFor(() => screen.getByText('Agendar Consulta'));
    fireEvent.click(screen.getAllByText('Agendar Consulta')[0]);
    expect(mockNavigate).toHaveBeenCalledWith('/patient/appointments/new');
  });

  it('navigates to appointments when "Meus Agendamentos" button is clicked', async () => {
    renderWithAuth(<PatientDashboard />);
    await waitFor(() => screen.getByText('Meus Agendamentos'));
    fireEvent.click(screen.getByText('Meus Agendamentos'));
    expect(mockNavigate).toHaveBeenCalledWith('/patient/appointments');
  });

  it('navigates to profile when "Meu Perfil" button is clicked', async () => {
    renderWithAuth(<PatientDashboard />);
    await waitFor(() => screen.getByText('Meu Perfil'));
    fireEvent.click(screen.getByText('Meu Perfil'));
    expect(mockNavigate).toHaveBeenCalledWith('/patient/profile');
  });

  it('shows health summary cards with correct counts', async () => {
    renderWithAuth(<PatientDashboard />);
    await waitFor(() => {
      expect(screen.getByText('Total de Consultas')).toBeInTheDocument();
      expect(screen.getByText('Consultas Realizadas')).toBeInTheDocument();
      expect(screen.getByText('Consultas Pendentes')).toBeInTheDocument();
      expect(screen.getByText('2')).toBeInTheDocument(); // total
      const ones = screen.getAllByText('1');
      expect(ones).toHaveLength(2); // completed and pending
    });
  });

  it('shows allergy and medication reminders if medical history exists', async () => {
    renderWithAuth(<PatientDashboard />, { patientUser: mockPatientUserWithMedicalHistory });
    await waitFor(() => {
      expect(screen.getByText('Alergias Registradas')).toBeInTheDocument();
      expect(screen.getByText('Medicações')).toBeInTheDocument();
    });
  });

  it('shows "Complete seu Perfil de Saúde" reminder if medical history is missing', async () => {
    renderWithAuth(<PatientDashboard />);
    await waitFor(() => {
      expect(screen.getByText('Complete seu Perfil de Saúde')).toBeInTheDocument();
    });
  });

  it('navigates to profile when "Completar Perfil" button is clicked in reminder', async () => {
    renderWithAuth(<PatientDashboard />);
    await waitFor(() => screen.getByText('Completar Perfil'));
    fireEvent.click(screen.getByText('Completar Perfil'));
    expect(mockNavigate).toHaveBeenCalledWith('/patient/profile');
  });

  it('shows cleaning reminder always', async () => {
    renderWithAuth(<PatientDashboard />);
    await waitFor(() => {
      expect(screen.getByText('Higienização')).toBeInTheDocument();
      expect(screen.getByText('Limpeza dental profissional recomendada a cada 6 meses')).toBeInTheDocument();
    });
  });

  it('shows "Agende sua próxima consulta" reminder if no upcoming appointments', async () => {
    (apiService.appointments.getAll as jest.Mock).mockResolvedValue({ success: true, data: [] });
    renderWithAuth(<PatientDashboard />);
    await waitFor(() => {
      expect(screen.getByText('Agende sua próxima consulta')).toBeInTheDocument();
    });
  });
});
