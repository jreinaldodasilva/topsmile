// src/tests/integration/PatientAppointmentBooking.test.tsx
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import { PatientAuthProvider } from '../../contexts/PatientAuthContext';
import PatientAppointmentBooking from '../../pages/Patient/Appointment/PatientAppointmentBooking';
import { server } from '../../mocks/server';
import { http, HttpResponse } from 'msw';

const mockPatientUser = {
  _id: 'patient1',
  patient: { _id: 'patient1', name: 'John Doe', phone: '11999999999' },
  email: 'john@example.com',
  isActive: true,
  emailVerified: true
};

describe('Patient Appointment Booking Integration', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false }, mutations: { retry: false } }
    });

    // Mock providers API
    server.use(
      http.get('*/api/providers', () => {
        return HttpResponse.json({
          success: true,
          data: [
            { _id: 'provider1', name: 'Dr. Smith', specialties: ['General Dentistry'] },
            { _id: 'provider2', name: 'Dr. Jones', specialties: ['Orthodontics'] }
          ]
        });
      }),
      http.get('*/api/appointment-types', () => {
        return HttpResponse.json({
          success: true,
          data: [
            { _id: 'type1', name: 'Consultation', duration: 30, price: 100 },
            { _id: 'type2', name: 'Cleaning', duration: 45, price: 80 }
          ]
        });
      })
    );
  });

  it('should complete full appointment booking flow', async () => {
    const mockNavigate = jest.fn();
    jest.mock('react-router-dom', () => ({
      ...jest.requireActual('react-router-dom'),
      useNavigate: () => mockNavigate
    }));

    // Mock successful appointment creation
    server.use(
      http.post('*/api/appointments', () => {
        return HttpResponse.json({
          success: true,
          data: {
            _id: 'appt123',
            patient: 'patient1',
            provider: 'provider1',
            appointmentType: 'type1',
            scheduledStart: '2024-12-01T10:00:00.000Z',
            status: 'scheduled'
          }
        });
      })
    );

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <PatientAuthProvider>
            <PatientAppointmentBooking />
          </PatientAuthProvider>
        </MemoryRouter>
      </QueryClientProvider>
    );

    // Wait for providers to load
    await waitFor(() => {
      expect(screen.getByText('Dr. Smith')).toBeInTheDocument();
    });

    // Select provider
    fireEvent.change(screen.getByLabelText(/dentista/i), {
      target: { value: 'provider1' }
    });

    // Select appointment type
    fireEvent.change(screen.getByLabelText(/tipo de consulta/i), {
      target: { value: 'type1' }
    });

    // Select date
    fireEvent.change(screen.getByLabelText(/data/i), {
      target: { value: '2024-12-01' }
    });

    // Wait for time slots to load
    await waitFor(() => {
      expect(screen.getByText('10:00')).toBeInTheDocument();
    });

    // Select time slot
    fireEvent.click(screen.getByText('10:00'));

    // Confirm booking
    fireEvent.click(screen.getByText(/confirmar agendamento/i));

    // Should navigate to appointments list with success message
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/patient/appointments', {
        state: { message: 'Consulta agendada com sucesso!' }
      });
    });
  });

  it('should handle booking conflicts gracefully', async () => {
    // Mock conflict response
    server.use(
      http.post('*/api/appointments', () => {
        return HttpResponse.json({
          success: false,
          message: 'Horário não disponível'
        }, { status: 409 });
      })
    );

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <PatientAuthProvider>
            <PatientAppointmentBooking />
          </PatientAuthProvider>
        </MemoryRouter>
      </QueryClientProvider>
    );

    // Complete booking flow...
    await waitFor(() => {
      expect(screen.getByText('Dr. Smith')).toBeInTheDocument();
    });

    fireEvent.change(screen.getByLabelText(/dentista/i), { target: { value: 'provider1' } });
    fireEvent.change(screen.getByLabelText(/tipo de consulta/i), { target: { value: 'type1' } });
    fireEvent.change(screen.getByLabelText(/data/i), { target: { value: '2024-12-01' } });

    await waitFor(() => {
      expect(screen.getByText('10:00')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('10:00'));
    fireEvent.click(screen.getByText(/confirmar agendamento/i));

    // Should show error message
    await waitFor(() => {
      expect(screen.getByText('Horário não disponível')).toBeInTheDocument();
    });
  });
});
