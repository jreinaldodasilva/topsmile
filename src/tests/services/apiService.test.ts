import { apiService } from '../../services/apiService';
import type { User, Contact, Patient, Clinic } from '@topsmile/types';

// Mock the http service
jest.mock('../../services/http', () => ({
  request: jest.fn()
}));

import { request } from '../../services/http';

// Helper to create mock response
const createMockResponse = (overrides: any = {}) => ({
  ok: true,
  status: 200,
  data: null,
  message: '',
  ...overrides
});


describe('apiService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('auth methods', () => {
    describe('login', () => {
      it('should successfully login with valid credentials', async () => {
        (request as jest.Mock).mockResolvedValueOnce(createMockResponse({
          data: {
            user: { id: 'user123', name: 'Admin User', email: 'admin@topsmile.com', role: 'admin' },
            accessToken: 'mock-access-token',
            refreshToken: 'mock-refresh-token'
          }
        }));

        const result = await apiService.auth.login(process.env.TEST_ADMIN_EMAIL || 'admin@topsmile.com', process.env.TEST_ADMIN_PASSWORD || 'SecurePass123!');

        expect(result.success).toBe(true);
        expect(result.data).toBeDefined();
        expect(result.data?.user).toBeDefined();
        expect(result.data?.accessToken).toBe('mock-access-token');
        expect(result.data?.refreshToken).toBe('mock-refresh-token');
      });

      it('should handle login failure with invalid credentials', async () => {
        (request as jest.Mock).mockResolvedValueOnce(createMockResponse({
          ok: false,
          status: 401,
          message: 'E-mail ou senha inválidos'
        }));

        const result = await apiService.auth.login('invalid@example.com', 'wrongpassword');

        expect(result.success).toBe(false);
        expect(result.message).toContain('E-mail ou senha inválidos');
      });

      it('should handle network errors', async () => {
        (request as jest.Mock).mockRejectedValueOnce(new Error('Network request failed'));

        const result = await apiService.auth.login('test@example.com', 'password');

        expect(result.success).toBe(false);
        expect(result.message).toContain('Network request failed');
      });
    });

    describe('register', () => {
      it('should successfully register a new user', async () => {
        const registerData = {
          name: 'New User',
          email: 'newuser@example.com',
          password: process.env.TEST_USER_PASSWORD || 'SecurePass123!'
        };

        (request as jest.Mock).mockResolvedValueOnce(createMockResponse({
          status: 201,
          data: {
            user: { id: 'user456', name: registerData.name, email: registerData.email, role: 'dentist' },
            accessToken: 'new-access-token',
            refreshToken: 'new-refresh-token'
          }
        }));

        const result = await apiService.auth.register(registerData);

        expect(result.success).toBe(true);
        expect(result.data).toBeDefined();
        expect(result.data?.user.name).toBe(registerData.name);
        expect(result.data?.user.email).toBe(registerData.email);
      });
    });

    describe('me', () => {
      it('should get current user data', async () => {
        (request as jest.Mock).mockResolvedValueOnce(createMockResponse({
          data: { id: 'user123', name: 'Current User', email: 'current@example.com', role: 'admin' }
        }));

        const result = await apiService.auth.me();

        expect(result.success).toBe(true);
        expect(result.data).toBeDefined();
        expect(result.data?.name).toBe('Current User');
      });
    });
  });

  describe('patients methods', () => {
    describe('getAll', () => {
      it('should get all patients', async () => {
        (request as jest.Mock).mockResolvedValueOnce(createMockResponse({
          data: [
            { _id: '1', firstName: 'João', lastName: 'Silva' },
            { _id: '2', firstName: 'Maria', lastName: 'Santos' }
          ]
        }));

        const result = await apiService.patients.getAll();

        expect(result.success).toBe(true);
        expect(result.data).toBeDefined();
        expect(Array.isArray(result.data)).toBe(true);
        expect(result.data).toHaveLength(2);
      });

      it('should handle query parameters', async () => {
        (request as jest.Mock).mockResolvedValueOnce(createMockResponse({
          data: [{ _id: '1', firstName: 'João', lastName: 'Silva' }]
        }));

        const result = await apiService.patients.getAll({ search: 'João', page: 1, limit: 10 });

        expect(result.success).toBe(true);
        expect(result.data).toBeDefined();
        expect(Array.isArray(result.data)).toBe(true);
      });
    });

    describe('getOne', () => {
      it('should get patient by ID', async () => {
        (request as jest.Mock).mockResolvedValueOnce(createMockResponse({
          data: { _id: 'patient123', firstName: 'João', lastName: 'Silva' }
        }));

        const result = await apiService.patients.getOne('patient123');

        expect(result.success).toBe(true);
        expect(result.data).toBeDefined();
        expect(result.data?._id).toBe('patient123');
        expect(result.data?.firstName).toBe('João');
      });

      it('should handle non-existent patient', async () => {
        (request as jest.Mock).mockResolvedValueOnce(createMockResponse({
          ok: false,
          status: 404,
          message: 'Paciente não encontrado'
        }));

        const result = await apiService.patients.getOne('non-existent-id');

        expect(result.success).toBe(false);
        expect(result.message).toContain('Paciente não encontrado');
      });
    });

    describe('create', () => {
      it('should create a new patient', async () => {
        const patientData = {
          firstName: 'New',
          lastName: 'Patient',
          email: 'new.patient@example.com',
          phone: '(11) 99999-9999',
          name: 'New Patient',
          address: { street: `Rua Teste`, number: '100', neighborhood: 'Centro', city: 'São Paulo', state: 'SP', zipCode: '01000-000' },
        };

        (request as jest.Mock).mockResolvedValueOnce(createMockResponse({
          status: 201,
          data: { _id: 'new-patient', fullName: 'New Patient', email: patientData.email }
        }));

        const result = await apiService.patients.create(patientData);

        expect(result.success).toBe(true);
        expect(result.data).toBeDefined();
        expect(result.data?.fullName).toBe('New Patient');
        expect(result.data?.email).toBe(patientData.email);
      });
    });

    describe('update', () => {
      it('should update patient data', async () => {
        const updateData = {
          firstName: 'Updated',
          lastName: 'Name',
          phone: '(11) 88888-8888'
        };

        (request as jest.Mock).mockResolvedValueOnce(createMockResponse({
          data: { _id: 'patient123', fullName: 'Updated Name' }
        }));

        const result = await apiService.patients.update('patient123', updateData);

        expect(result.success).toBe(true);
        expect(result.data).toBeDefined();
        expect(result.data?.fullName).toBe('Updated Name');
      });
    });

    describe('delete', () => {
      it('should delete patient', async () => {
        (request as jest.Mock).mockResolvedValueOnce(createMockResponse({
          data: null,
          message: 'Paciente removido com sucesso'
        }));

        const result = await apiService.patients.delete('patient123');

        expect(result.success).toBe(true);
        expect(result.message).toContain('Paciente removido com sucesso');
      });
    });
  });

  describe('contacts methods', () => {
    describe('getAll', () => {
      it('should get all contacts', async () => {
        (request as jest.Mock).mockResolvedValueOnce(createMockResponse({
          data: {
            contacts: [
              { _id: '1', name: 'Contact 1' },
              { _id: '2', name: 'Contact 2' }
            ],
            total: 2
          }
        }));

        const result = await apiService.contacts.getAll();

        expect(result.success).toBe(true);
        expect(result.data).toBeDefined();
        expect(result.data).toHaveProperty('contacts');
        expect(result.data).toHaveProperty('total');
        expect(result.data?.contacts).toHaveLength(2);
      });
    });

    describe('create', () => {
      it('should create a new contact', async () => {
        const contactData = {
          name: 'New Contact',
          email: 'new.contact@example.com',
          phone: '(11) 99999-9999',
          clinic: 'Test Clinic',
          specialty: 'Ortodontia'
        };

        (request as jest.Mock).mockResolvedValueOnce(createMockResponse({
          status: 201,
          data: { _id: 'new-contact', name: contactData.name }
        }));

        const result = await apiService.contacts.create(contactData);

        expect(result.success).toBe(true);
        expect(result.data).toBeDefined();
        expect(result.data?.name).toBe(contactData.name);
      });
    });
  });

  describe('appointments methods', () => {
    describe('getAll', () => {
      it('should get all appointments', async () => {
        (request as jest.Mock).mockResolvedValueOnce(createMockResponse({
          data: [
            { _id: '1', patient: 'patient1', status: 'scheduled' },
            { _id: '2', patient: 'patient2', status: 'completed' }
          ]
        }));

        const result = await apiService.appointments.getAll();

        expect(result.success).toBe(true);
        expect(result.data).toBeDefined();
        expect(Array.isArray(result.data)).toBe(true);
      });
    });

    describe('create', () => {
      it('should create a new appointment', async () => {
        const appointmentData = {
          patient: 'patient123',
          clinic: 'clinic123',
          provider: 'provider123',
          appointmentType: 'type123',
          scheduledStart: new Date('2024-02-15T10:00:00Z'),
          scheduledEnd: new Date('2024-02-15T11:00:00Z'),
          status: 'scheduled' as const,
          priority: 'routine' as const,
          preferredContactMethod: 'email' as const,
          syncStatus: 'synced' as const,
          notes: 'Test appointment',
          privateNotes: 'Internal note'
        };

        (request as jest.Mock).mockResolvedValueOnce(createMockResponse({
          status: 201,
          data: {
            _id: 'new-appointment',
            patient: appointmentData.patient,
            status: appointmentData.status
          }
        }));

        const result = await apiService.appointments.create(appointmentData);

        expect(result.success).toBe(true);
        expect(result.data).toBeDefined();
        expect(result.data?.patient).toBe(appointmentData.patient);
        expect(result.data?.status).toBe(appointmentData.status);
      });
    });
  });

  describe('dashboard methods', () => {
    describe('getStats', () => {
      it('should get dashboard statistics', async () => {
        (request as jest.Mock).mockResolvedValueOnce(createMockResponse({
          data: {
            totalPatients: 150,
            todayAppointments: 12,
            monthlyRevenue: 25000,
            satisfaction: 4.5
          }
        }));

        const result = await apiService.dashboard.getStats();

        expect(result.success).toBe(true);
        expect(result.data).toBeDefined();
        expect(result.data).toHaveProperty('totalPatients');
        expect(result.data).toHaveProperty('todayAppointments');
        expect(result.data).toHaveProperty('monthlyRevenue');
        expect(result.data).toHaveProperty('satisfaction');
      });
    });
  });

  describe('public methods', () => {
    describe('sendContactForm', () => {
      it('should send contact form successfully', async () => {
        const contactData = {
          name: 'Test User',
          email: 'test@example.com',
          clinic: 'Test Clinic',
          specialty: 'Ortodontia',
          phone: '(11) 99999-9999'
        };

        (request as jest.Mock).mockResolvedValueOnce(createMockResponse({
          status: 201,
          data: {
            id: 'contact-123',
            protocol: 'PROTOCOL-2024-001',
            estimatedResponse: '2 horas'
          }
        }));

        const result = await apiService.public.sendContactForm(contactData);

        expect(result.success).toBe(true);
        expect(result.data).toBeDefined();
        expect(result.data).toHaveProperty('id');
        expect(result.data).toHaveProperty('protocol');
        expect(result.data).toHaveProperty('estimatedResponse');
      });
    });
  });

  describe('system methods', () => {
    describe('health', () => {
      it('should get health status', async () => {
        (request as jest.Mock).mockResolvedValueOnce(createMockResponse({
          data: {
            timestamp: '2024-01-01T00:00:00Z',
            uptime: 3600,
            database: 'connected',
            memory: { used: 100, total: 1000 },
            environment: 'test',
            version: '1.0.0'
          }
        }));

        const result = await apiService.system.health();

        expect(result.success).toBe(true);
        expect(result.data).toBeDefined();
        expect(result.data).toHaveProperty('timestamp');
        expect(result.data).toHaveProperty('uptime');
        expect(result.data).toHaveProperty('database');
        expect(result.data).toHaveProperty('memory');
        expect(result.data).toHaveProperty('environment');
        expect(result.data).toHaveProperty('version');
      });
    });
  });

  describe('Error Handling and Edge Cases', () => {
    describe('Network Timeouts', () => {
      it('should handle network timeout errors', async () => {
        // Mock a timeout error
        const timeoutError = new Error('Network request timed out');
        timeoutError.name = 'TimeoutError';
        (request as jest.Mock).mockRejectedValueOnce(timeoutError);

        const result = await apiService.auth.login('test@example.com', 'password');

        expect(result.success).toBe(false);
        expect(result.message).toContain('Network request timed out');
      });

      it('should retry on timeout for critical operations', async () => {
        // Mock first call timeout, second call success
        const timeoutError = new Error('Network request timed out');
        timeoutError.name = 'TimeoutError';

        (request as jest.Mock)
          .mockRejectedValueOnce(timeoutError)
          .mockResolvedValueOnce(createMockResponse({
            data: {
              user: { id: 'user123', name: 'Test User', email: 'test@example.com', role: 'admin' },
              accessToken: 'retry-token',
              refreshToken: 'retry-refresh'
            }
          }));

        const result = await apiService.auth.login('test@example.com', 'password');

        expect(result.success).toBe(true);
        expect(result.data?.accessToken).toBe('retry-token');
        expect(request).toHaveBeenCalledTimes(2);
      });
    });

    describe('Malformed Responses', () => {
      it('should handle malformed JSON responses', async () => {
        // Mock response with invalid JSON
        (request as jest.Mock).mockRejectedValueOnce(new Error('Invalid JSON response'));

        const result = await apiService.patients.getAll();

        expect(result.success).toBe(false);
        expect(result.message).toContain('Invalid JSON response');
      });

      it('should handle unexpected response structure', async () => {
        // Mock response missing required fields
        (request as jest.Mock).mockResolvedValueOnce(createMockResponse({
          data: { unexpectedField: 'value' } // Missing expected structure
        }));

        const result = await apiService.auth.me();

        // Should still handle gracefully even if structure is unexpected
        expect(result.success).toBe(true);
        expect(result.data).toEqual({ unexpectedField: 'value' });
      });

      it('should handle empty response data', async () => {
        (request as jest.Mock).mockResolvedValueOnce(createMockResponse({
          data: null
        }));

        const result = await apiService.contacts.getAll();

        expect(result.success).toBe(true);
        expect(result.data).toBeNull();
      });
    });

    describe('Retry Logic', () => {
      it('should retry on 5xx server errors', async () => {
        (request as jest.Mock)
          .mockResolvedValueOnce(createMockResponse({
            ok: false,
            status: 500,
            message: 'Internal server error'
          }))
          .mockResolvedValueOnce(createMockResponse({
            data: { id: 'user123', name: 'Test User', email: 'test@example.com', role: 'admin' }
          }));

        const result = await apiService.auth.me();

        expect(result.success).toBe(true);
        expect(result.data?.name).toBe('Test User');
        expect(request).toHaveBeenCalledTimes(2);
      });

      it('should not retry on 4xx client errors', async () => {
        (request as jest.Mock).mockResolvedValueOnce(createMockResponse({
          ok: false,
          status: 404,
          message: 'Not found'
        }));

        const result = await apiService.patients.getOne('nonexistent');

        expect(result.success).toBe(false);
        expect(result.message).toContain('Not found');
        expect(request).toHaveBeenCalledTimes(1);
      });

      it('should limit retry attempts', async () => {
        // Mock multiple failures
        (request as jest.Mock).mockResolvedValue(createMockResponse({
          ok: false,
          status: 500,
          message: 'Server error'
        }));

        const result = await apiService.auth.login('test@example.com', 'password');

        expect(result.success).toBe(false);
        expect(result.message).toContain('Server error');
        // Should not retry indefinitely
        expect(request).toHaveBeenCalledTimes(1); // Assuming no retry for auth login
      });
    });

    describe('Error Boundary Integration', () => {
      it('should propagate errors to error boundary', async () => {
        (request as jest.Mock).mockRejectedValueOnce(new Error('Critical API failure'));

        const result = await apiService.appointments.getAll();

        expect(result.success).toBe(false);
        expect(result.message).toContain('Critical API failure');
        // In a real app, this would trigger error boundary
      });
    });
  });
});
