import { apiService } from '../../services/apiService';
import { server } from '../../mocks/server';
import { http, HttpResponse } from 'msw';

describe('Backend API Contract Validation', () => {
  afterEach(() => {
    server.resetHandlers();
  });
  describe('Response Structure', () => {
    beforeEach(() => {
      server.use(
        http.post('*/api/auth/login', () => {
          return HttpResponse.json({
            success: true,
            data: {
              user: { id: 'user1', name: 'Test User', email: 'test@test.com' },
              accessToken: 'token',
              refreshToken: 'refresh'
            }
          });
        }),
        http.get('*/api/patients', () => {
          return HttpResponse.json({
            success: true,
            data: [
              { id: 'patient1', name: 'Patient 1' },
              { id: 'patient2', name: 'Patient 2' }
            ]
          });
        })
      );
    });

    it('should return responses wrapped in standard format', async () => {
      const response = await apiService.auth.login('test@test.com', 'password');

      expect(response).toHaveProperty('success');
      expect(response).toHaveProperty('data');
      expect(typeof response.success).toBe('boolean');
    });

    it('should use id not _id in JSON responses', async () => {
      const response = await apiService.patients.getAll();

      expect(response.success).toBe(true);
      expect(response.data).toBeDefined();
      expect(response.data).toBeInstanceOf(Array);
      response.data!.forEach((patient: any) => {
        expect(patient).toHaveProperty('id');
        expect(patient).not.toHaveProperty('_id');
      });
    });
  });
  
  describe('Password Validation', () => {
    beforeEach(() => {
      server.use(
        http.post('*/api/auth/register', async ({ request }) => {
          const body = await request.json() as { password: string };
          if (!/[A-Z]/.test(body.password)) {
            return HttpResponse.json({
              success: false,
              message: 'A senha deve conter pelo menos uma letra maiúscula'
            }, { status: 400 });
          }
          if (body.password === 'password123') {
            return HttpResponse.json({
              success: false,
              message: 'A senha é muito comum, por favor escolha uma mais forte'
            }, { status: 400 });
          }
          return HttpResponse.json({
            success: true,
            data: { user: { id: 'user1' } }
          });
        })
      );
    });

    it('should reject passwords without uppercase', async () => {
      const response = await apiService.auth.register({
        name: 'Test User',
        email: 'test@test.com',
        password: 'password123'  // No uppercase
      });

      expect(response.success).toBe(false);
      expect(response.message).toMatch(/maiúscula/i);
    });

    it('should reject common passwords', async () => {
      const response = await apiService.auth.register({
        name: 'Test User',
        email: 'test@test.com',
        password: 'password123'
      });

      expect(response.success).toBe(false);
      expect(response.message).toMatch(/muito comum/i);
    });
  });
  
  describe('Rate Limiting', () => {
    let contactCallCount = 0;

    beforeEach(() => {
      contactCallCount = 0;
      server.use(
        http.post('*/api/public/contact', () => {
          contactCallCount++;
          if (contactCallCount > 5) {
            return HttpResponse.json({
              success: false,
              message: 'Limite de tentativas excedido. Tente novamente em 15 minutos.'
            }, { status: 429 });
          }
          return HttpResponse.json({
            success: true,
            data: { id: 'contact1' }
          });
        })
      );
    });

    it('should enforce contact form rate limit', async () => {
      const formData = {
        name: 'Test',
        email: 'test@test.com',
        clinic: 'Test Clinic',
        specialty: 'General',
        phone: '1234567890'
      };

      // Submit 5 times (limit)
      for (let i = 0; i < 5; i++) {
        const res = await apiService.public.sendContactForm(formData);
        expect(res.success).toBe(true);
      }

      // 6th should be rate limited
      const response = await apiService.public.sendContactForm(formData);

      expect(response.success).toBe(false);
      expect(response.message).toMatch(/15 minutos/i);
    });
  });
  
  describe('Account Lockout', () => {
    let loginAttempts: Record<string, number> = {};

    beforeEach(() => {
      loginAttempts = {};
      server.use(
        http.post('*/api/auth/login', async ({ request }) => {
          const body = await request.json() as { email: string; password: string };
          const { email } = body;
          if (!loginAttempts[email]) loginAttempts[email] = 0;
          loginAttempts[email]++;
          if (loginAttempts[email] > 5) {
            return HttpResponse.json({
              success: false,
              message: 'Conta bloqueada devido a múltiplas tentativas de login falhadas'
            }, { status: 429 });
          }
          return HttpResponse.json({
            success: false,
            message: 'E-mail ou senha inválidos'
          }, { status: 401 });
        })
      );
    });

    it('should lock account after 5 failed login attempts', async () => {
      const email = 'test@test.com';

      // 5 failed attempts
      for (let i = 0; i < 5; i++) {
        const res = await apiService.auth.login(email, 'wrong-password');
        expect(res.success).toBe(false);
      }

      // 6th attempt should show lockout
      const response = await apiService.auth.login(email, 'wrong-password');

      expect(response.success).toBe(false);
      expect(response.message).toMatch(/bloqueada|locked/i);
    });
  });
  
  describe('Appointment Conflicts', () => {
    let appointments: any[] = [];

    beforeEach(() => {
      appointments = [];
      server.use(
        http.post('*/api/appointments', async ({ request }) => {
          const body = await request.json() as any;
          // Check for conflicts
          const conflict = appointments.find(app =>
            app.room === body.room &&
            app.scheduledStart < body.scheduledEnd &&
            app.scheduledEnd > body.scheduledStart
          );
          if (conflict) {
            return HttpResponse.json({
              success: false,
              message: 'Conflito de horário detectado para esta sala'
            }, { status: 409 });
          }
          appointments.push(body);
          return HttpResponse.json({
            success: true,
            data: { id: 'appt1', ...body }
          });
        })
      );
    });

    it('should detect room conflicts across providers', async () => {
      const appointmentData = {
        patient: 'patient1',
        provider: 'provider1',
        clinic: 'clinic1',
        appointmentType: 'type1',
        room: 'Room A',
        scheduledStart: new Date('2024-12-01T10:00:00Z'),
        scheduledEnd: new Date('2024-12-01T11:00:00Z'),
        status: 'scheduled' as const,
        priority: 'routine' as const,
        preferredContactMethod: 'phone' as const,
        syncStatus: 'synced' as const
      };

      // Create first appointment
      const first = await apiService.appointments.create(appointmentData);
      expect(first.success).toBe(true);

      // Try to book same room, different provider, overlapping time
      const conflict = await apiService.appointments.create({
        ...appointmentData,
        provider: 'provider2'  // Different provider, same room
      });

      expect(conflict.success).toBe(false);
      expect(conflict.message).toMatch(/conflito|conflict/i);
    });
  });
});
