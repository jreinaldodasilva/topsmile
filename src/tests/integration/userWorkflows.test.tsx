import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../../contexts/AuthContext';
import App from '../../App';

// Mock API service
jest.mock('../../services/apiService', () => ({
    apiService: {
        auth: {
            login: jest.fn(),
            register: jest.fn(),
            logout: jest.fn()
        },
        patients: {
            list: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            delete: jest.fn()
        },
        appointments: {
            list: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            delete: jest.fn()
        }
    }
}));

const renderApp = () => {
    return render(
        <BrowserRouter>
            <AuthProvider>
                <App />
            </AuthProvider>
        </BrowserRouter>
    );
};

describe('User Workflows Integration Tests', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        localStorage.clear();
    });

    describe('Authentication Workflow', () => {
        it('should complete login workflow', async () => {
            const user = userEvent.setup();
            const mockLogin = require('../../services/apiService').apiService.auth.login;

            mockLogin.mockResolvedValue({
                success: true,
                data: {
                    user: { id: '1', name: 'Admin', email: 'admin@example.com', role: 'admin' },
                    token: 'mock-token'
                }
            });

            renderApp();

            // Should show login form initially
            expect(screen.getByText(/topsmile admin/i)).toBeInTheDocument();

            // Fill login form
            const emailInput = screen.getByLabelText(/e-mail/i);
            const passwordInput = screen.getByLabelText(/senha/i);
            const loginButton = screen.getByRole('button', { name: /entrar/i });

            await user.type(emailInput, 'admin@example.com');
            await user.type(passwordInput, 'password123');
            await user.click(loginButton);

            // Should redirect to dashboard after successful login
            await waitFor(() => {
                expect(mockLogin).toHaveBeenCalledWith('admin@example.com', 'password123');
            });
        });

        it('should handle login errors', async () => {
            const user = userEvent.setup();
            const mockLogin = require('../../services/apiService').apiService.auth.login;

            mockLogin.mockRejectedValue(new Error('Credenciais inválidas'));

            renderApp();

            const emailInput = screen.getByLabelText(/e-mail/i);
            const passwordInput = screen.getByLabelText(/senha/i);
            const loginButton = screen.getByRole('button', { name: /entrar/i });

            await user.type(emailInput, 'wrong@example.com');
            await user.type(passwordInput, 'wrongpassword');
            await user.click(loginButton);

            await waitFor(() => {
                expect(screen.getByText(/credenciais inválidas/i)).toBeInTheDocument();
            });
        });

        it('should handle logout workflow', async () => {
            const user = userEvent.setup();
            const mockLogout = require('../../services/apiService').apiService.auth.logout;

            // Mock authenticated state
            localStorage.setItem('auth_token', 'mock-token');
            localStorage.setItem(
                'user',
                JSON.stringify({
                    id: '1',
                    name: 'Admin',
                    email: 'admin@example.com',
                    role: 'admin'
                })
            );

            mockLogout.mockResolvedValue({ success: true });

            renderApp();

            // Should show dashboard for authenticated user
            await waitFor(() => {
                expect(screen.getByText(/dashboard/i)).toBeInTheDocument();
            });

            // Click logout
            const logoutButton = screen.getByRole('button', { name: /logout/i });
            await user.click(logoutButton);

            await waitFor(() => {
                expect(mockLogout).toHaveBeenCalled();
                expect(screen.getByText(/topsmile admin/i)).toBeInTheDocument();
            });
        });
    });

    describe('Patient Management Workflow', () => {
        beforeEach(() => {
            // Mock authenticated state
            localStorage.setItem('auth_token', 'mock-token');
            localStorage.setItem(
                'user',
                JSON.stringify({
                    id: '1',
                    name: 'Admin',
                    email: 'admin@example.com',
                    role: 'admin'
                })
            );
        });

        it('should complete patient creation workflow', async () => {
            const user = userEvent.setup();
            const mockPatientsList = require('../../services/apiService').apiService.patients.list;
            const mockPatientsCreate = require('../../services/apiService').apiService.patients.create;

            mockPatientsList.mockResolvedValue({
                success: true,
                data: { patients: [], total: 0 }
            });

            mockPatientsCreate.mockResolvedValue({
                success: true,
                data: {
                    _id: '1',
                    firstName: 'João',
                    lastName: 'Silva',
                    phone: '(11) 99999-9999',
                    email: 'joao@example.com'
                }
            });

            renderApp();

            // Navigate to patients page
            await waitFor(() => {
                const patientsLink = screen.getByRole('link', { name: /pacientes/i });
                user.click(patientsLink);
            });

            // Click create patient button
            await waitFor(() => {
                const createButton = screen.getByRole('button', { name: /novo paciente/i });
                user.click(createButton);
            });

            // Fill patient form
            await waitFor(() => {
                const firstNameInput = screen.getByLabelText(/nome \*/i);
                const phoneInput = screen.getByLabelText(/telefone \*/i);
                const submitButton = screen.getByRole('button', { name: /criar paciente/i });

                user.type(firstNameInput, 'João');
                user.type(phoneInput, '(11) 99999-9999');
                user.click(submitButton);
            });

            await waitFor(() => {
                expect(mockPatientsCreate).toHaveBeenCalledWith(
                    expect.objectContaining({
                        firstName: 'João',
                        phone: '(11) 99999-9999'
                    })
                );
            });
        });

        it('should handle patient search workflow', async () => {
            const user = userEvent.setup();
            const mockPatientsList = require('../../services/apiService').apiService.patients.list;

            mockPatientsList.mockResolvedValue({
                success: true,
                data: {
                    patients: [
                        { _id: '1', firstName: 'João', lastName: 'Silva', phone: '(11) 99999-9999' },
                        { _id: '2', firstName: 'Maria', lastName: 'Santos', phone: '(11) 88888-8888' }
                    ],
                    total: 2
                }
            });

            renderApp();

            // Navigate to patients page
            await waitFor(() => {
                const patientsLink = screen.getByRole('link', { name: /pacientes/i });
                user.click(patientsLink);
            });

            // Use search functionality
            await waitFor(() => {
                const searchInput = screen.getByPlaceholderText(/buscar pacientes/i);
                user.type(searchInput, 'João');
            });

            await waitFor(() => {
                expect(mockPatientsList).toHaveBeenCalledWith(
                    expect.objectContaining({
                        search: 'João'
                    })
                );
            });
        });
    });

    describe('Appointment Management Workflow', () => {
        beforeEach(() => {
            // Mock authenticated state
            localStorage.setItem('auth_token', 'mock-token');
            localStorage.setItem(
                'user',
                JSON.stringify({
                    id: '1',
                    name: 'Dr. Admin',
                    email: 'admin@example.com',
                    role: 'dentist'
                })
            );
        });

        it('should complete appointment scheduling workflow', async () => {
            const user = userEvent.setup();
            const mockAppointmentsList = require('../../services/apiService').apiService.appointments.list;
            const mockAppointmentsCreate = require('../../services/apiService').apiService.appointments.create;
            const mockPatientsList = require('../../services/apiService').apiService.patients.list;

            mockAppointmentsList.mockResolvedValue({
                success: true,
                data: []
            });

            mockPatientsList.mockResolvedValue({
                success: true,
                data: {
                    patients: [{ _id: '1', firstName: 'João', lastName: 'Silva' }]
                }
            });

            mockAppointmentsCreate.mockResolvedValue({
                success: true,
                data: {
                    _id: '1',
                    patient: '1',
                    scheduledStart: new Date(Date.now() + 24 * 60 * 60 * 1000),
                    scheduledEnd: new Date(Date.now() + 25 * 60 * 60 * 1000)
                }
            });

            renderApp();

            // Navigate to appointments page
            await waitFor(() => {
                const appointmentsLink = screen.getByRole('link', { name: /agendamentos/i });
                user.click(appointmentsLink);
            });

            // Click create appointment button
            await waitFor(() => {
                const createButton = screen.getByRole('button', { name: /novo agendamento/i });
                user.click(createButton);
            });

            // Fill appointment form
            await waitFor(() => {
                const patientSelect = screen.getByLabelText(/paciente/i);
                const dateInput = screen.getByLabelText(/data/i);
                const timeInput = screen.getByLabelText(/horário/i);
                const submitButton = screen.getByRole('button', { name: /agendar/i });

                user.selectOptions(patientSelect, '1');
                user.type(dateInput, '2024-12-25');
                user.type(timeInput, '10:00');
                user.click(submitButton);
            });

            await waitFor(() => {
                expect(mockAppointmentsCreate).toHaveBeenCalledWith(
                    expect.objectContaining({
                        patient: '1'
                    })
                );
            });
        });

        it('should handle appointment conflict detection', async () => {
            const user = userEvent.setup();
            const mockAppointmentsCreate = require('../../services/apiService').apiService.appointments.create;

            mockAppointmentsCreate.mockRejectedValue(new Error('Horário indisponível'));

            renderApp();

            // Navigate to appointments and try to create conflicting appointment
            await waitFor(() => {
                const appointmentsLink = screen.getByRole('link', { name: /agendamentos/i });
                user.click(appointmentsLink);
            });

            await waitFor(() => {
                const createButton = screen.getByRole('button', { name: /novo agendamento/i });
                user.click(createButton);
            });

            // Fill form with conflicting time
            await waitFor(() => {
                const submitButton = screen.getByRole('button', { name: /agendar/i });
                user.click(submitButton);
            });

            await waitFor(() => {
                expect(screen.getByText(/horário indisponível/i)).toBeInTheDocument();
            });
        });
    });

    describe('Error Handling Workflows', () => {
        it('should handle network errors gracefully', async () => {
            const user = userEvent.setup();
            const mockLogin = require('../../services/apiService').apiService.auth.login;

            mockLogin.mockRejectedValue(new Error('Network Error'));

            renderApp();

            const emailInput = screen.getByLabelText(/e-mail/i);
            const passwordInput = screen.getByLabelText(/senha/i);
            const loginButton = screen.getByRole('button', { name: /entrar/i });

            await user.type(emailInput, 'admin@example.com');
            await user.type(passwordInput, 'password123');
            await user.click(loginButton);

            await waitFor(() => {
                expect(screen.getByText(/erro de conexão/i)).toBeInTheDocument();
            });
        });

        it('should handle session expiration', async () => {
            // Mock expired session
            localStorage.setItem('auth_token', 'expired-token');
            localStorage.setItem(
                'user',
                JSON.stringify({
                    id: '1',
                    name: 'Admin',
                    email: 'admin@example.com',
                    role: 'admin'
                })
            );

            const mockPatientsList = require('../../services/apiService').apiService.patients.list;
            mockPatientsList.mockRejectedValue(new Error('Token expired'));

            renderApp();

            await waitFor(() => {
                expect(screen.getByText(/sessão expirada/i)).toBeInTheDocument();
                expect(screen.getByText(/topsmile admin/i)).toBeInTheDocument();
            });
        });
    });

    describe('Accessibility Workflows', () => {
        it('should support keyboard navigation', async () => {
            const user = userEvent.setup();

            renderApp();

            // Tab through login form
            await user.tab();
            expect(screen.getByLabelText(/e-mail/i)).toHaveFocus();

            await user.tab();
            expect(screen.getByLabelText(/senha/i)).toHaveFocus();

            await user.tab();
            expect(screen.getByRole('button', { name: /entrar/i })).toHaveFocus();
        });

        it('should announce important changes to screen readers', async () => {
            const user = userEvent.setup();
            const mockLogin = require('../../services/apiService').apiService.auth.login;

            mockLogin.mockRejectedValue(new Error('Credenciais inválidas'));

            renderApp();

            const loginButton = screen.getByRole('button', { name: /entrar/i });
            await user.click(loginButton);

            await waitFor(() => {
                const errorMessage = screen.getByRole('alert');
                expect(errorMessage).toBeInTheDocument();
                expect(errorMessage).toHaveTextContent(/credenciais inválidas/i);
            });
        });
    });
});
