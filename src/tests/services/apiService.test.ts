import { apiService } from '../../services/apiService';
import type { User, Contact, Patient, Clinic } from '@topsmile/types';


describe('apiService', () => {
  describe('auth methods', () => {
    describe('login', () => {
      it('should successfully login with valid credentials', async () => {
        const result = await apiService.auth.login(process.env.TEST_ADMIN_EMAIL || 'admin@topsmile.com', process.env.TEST_ADMIN_PASSWORD || 'SecurePass123!');

        expect(result.success).toBe(true);
        expect(result.data).toBeDefined();
        expect(result.data?.user).toBeDefined();
        expect(result.data?.accessToken).toBe('mock-access-token');
        expect(result.data?.refreshToken).toBe('mock-refresh-token');
      });

      it('should handle login failure with invalid credentials', async () => {
        const result = await apiService.auth.login('invalid@example.com', 'wrongpassword');

        expect(result.success).toBe(false);
        expect(result.message).toContain('E-mail ou senha inválidos');
      });

      it('should handle network errors', async () => {
        const result = await apiService.auth.login('test@example.com', 'password');

        expect(result.success).toBe(false);
        expect(result.message).toContain('Network error');
      });
    });

    describe('register', () => {
      it('should successfully register a new user', async () => {
        const registerData = {
          name: 'New User',
          email: 'newuser@example.com',
          password: process.env.TEST_USER_PASSWORD || 'SecurePass123!'
        };

        const result = await apiService.auth.register(registerData);

        expect(result.success).toBe(true);
        expect(result.data).toBeDefined();
        expect(result.data?.user.name).toBe(registerData.name);
        expect(result.data?.user.email).toBe(registerData.email);
      });
    });

    describe('me', () => {
      it('should get current user data', async () => {
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
        const result = await apiService.patients.getAll();

        expect(result.success).toBe(true);
        expect(result.data).toBeDefined();
        expect(Array.isArray(result.data)).toBe(true);
        expect(result.data).toHaveLength(2);
      });

      it('should handle query parameters', async () => {
        const result = await apiService.patients.getAll({ search: 'João', page: 1, limit: 10 });

        expect(result.success).toBe(true);
        expect(result.data).toBeDefined();
        expect(Array.isArray(result.data)).toBe(true);
      });
    });

    describe('getOne', () => {
      it('should get patient by ID', async () => {
        const result = await apiService.patients.getOne('patient123');

        expect(result.success).toBe(true);
        expect(result.data).toBeDefined();
        expect(result.data?._id).toBe('patient123');
        expect(result.data?.firstName).toBe('João');
      });

      it('should handle non-existent patient', async () => {
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
        }

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

        const result = await apiService.patients.update('patient123', updateData);

        expect(result.success).toBe(true);
        expect(result.data).toBeDefined();
        expect(result.data?.fullName).toBe('Updated Name');
      });
    });

    describe('delete', () => {
      it('should delete patient', async () => {
        const result = await apiService.patients.delete('patient123');

        expect(result.success).toBe(true);
        expect(result.message).toContain('Paciente removido com sucesso');
      });
    });
  });

  describe('contacts methods', () => {
    describe('getAll', () => {
      it('should get all contacts', async () => {
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
});
