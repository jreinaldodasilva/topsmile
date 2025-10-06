// src/tests/integration/AppointmentFlow.test.tsx
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { appointmentService } from '../../features/appointments/services/appointmentService';

jest.mock('../../features/appointments/services/appointmentService');

const AppointmentList = () => {
  const [appointments, setAppointments] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(false);

  const loadAppointments = async () => {
    setLoading(true);
    const response = await appointmentService.getAppointments({
      startDate: '2024-01-01',
      endDate: '2024-01-31'
    });
    setAppointments(response.data);
    setLoading(false);
  };

  return (
    <div>
      <button onClick={loadAppointments}>Load Appointments</button>
      {loading && <div>Loading...</div>}
      {appointments.map((apt: any) => (
        <div key={apt.id}>{apt.patient.name}</div>
      ))}
    </div>
  );
};

describe('Appointment Flow Integration', () => {
  const queryClient = new QueryClient();

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('loads and displays appointments', async () => {
    const mockAppointments = [
      { id: '1', patient: { name: 'John Doe' } },
      { id: '2', patient: { name: 'Jane Smith' } }
    ];

    (appointmentService.getAppointments as jest.Mock).mockResolvedValue({
      data: mockAppointments
    });

    render(<AppointmentList />, { wrapper });

    fireEvent.click(screen.getByText('Load Appointments'));

    expect(screen.getByText('Loading...')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    });
  });

  it('handles appointment creation flow', async () => {
    const mockAppointment = { id: '1', patient: { name: 'New Patient' } };

    (appointmentService.create as jest.Mock).mockResolvedValue({
      data: mockAppointment
    });

    const result = await appointmentService.create({
      patient: 'patient-id',
      provider: 'provider-id',
      appointmentType: 'type-id',
      scheduledStart: '2024-01-15T10:00:00Z'
    });

    expect(result.data).toEqual(mockAppointment);
    expect(appointmentService.create).toHaveBeenCalledWith(
      expect.objectContaining({
        patient: 'patient-id',
        provider: 'provider-id'
      })
    );
  });
});
