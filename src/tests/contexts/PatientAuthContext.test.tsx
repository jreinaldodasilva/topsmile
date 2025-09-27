import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { PatientAuthProvider, usePatientAuth } from '../../contexts/PatientAuthContext';
import { server } from '../../setupTests';
import { http, HttpResponse } from 'msw';

// Test component to interact with the context
const TestComponent: React.FC = () => {
  const { patient, isLoading } = usePatientAuth() as any;

  return (
    <div>
      <div data-testid="loading">{isLoading ? 'loading' : 'loaded'}</div>
      <div data-testid="patient">{patient ? patient.name : 'no patient'}</div>
    </div>
  );
};

describe('PatientAuthContext', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('handles invalid tokens on mount', async () => {
    // Set invalid token
    localStorage.setItem('patient_access_token', 'invalid-token');

    // Mock API to return unauthorized
    server.use(
      http.get('*/api/patient/me', ({ request }) => {
        const authHeader = request.headers.get('Authorization');
        if (authHeader === 'Bearer invalid-token') {
          return HttpResponse.json(
            { success: false, message: 'Invalid token' },
            { status: 401 }
          );
        }
        return HttpResponse.json({ success: true, data: { name: 'Test User' } });
      })
    );

    render(
      <PatientAuthProvider>
        <TestComponent />
      </PatientAuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('patient')).toHaveTextContent('no patient');
      expect(screen.getByTestId('loading')).toHaveTextContent('loaded');
    });

    // Token should be cleared
    await waitFor(() => {
      expect(localStorage.getItem('patient_access_token')).toBeNull();
    });
  });

  it('loads patient data with valid token', async () => {
    // Set valid token
    localStorage.setItem('patient_access_token', 'valid-token');

    // Mock API to return patient data
    server.use(
      http.get('*/api/patient/me', ({ request }) => {
        const authHeader = request.headers.get('Authorization');
        if (authHeader === 'Bearer valid-token') {
          return HttpResponse.json({
            success: true,
            data: {
              _id: 'patient1',
              name: 'John Doe',
              email: 'john@example.com'
            }
          });
        }
        return HttpResponse.json(
          { success: false, message: 'Invalid token' },
          { status: 401 }
        );
      })
    );

    render(
      <PatientAuthProvider>
        <TestComponent />
      </PatientAuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('patient')).toHaveTextContent('John Doe');
      expect(screen.getByTestId('loading')).toHaveTextContent('loaded');
    });
  });
});
