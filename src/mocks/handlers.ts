import { http, HttpResponse } from 'msw';
import type { User, Contact, Patient } from '@topsmile/types';


export const handlers = [
  http.post('*/api/auth/login', async ({ request }) => {
    const body = await request.json() as { email: string; password: string };
    if (body.email === 'admin@topsmile.com' && body.password === 'SecurePass123!') {
      return HttpResponse.json({
        success: true,
        data: {
          user: {
            id: 'user123',
            name: 'Admin User',
            email: 'admin@topsmile.com',
            role: 'admin'
          },
          accessToken: 'mock-access-token',
          refreshToken: 'mock-refresh-token',
          expiresIn: '3600'
        }
      });
    } else if (body.email === 'test@example.com') {
      return HttpResponse.json({
        success: false,
        message: 'Network error - please check your connection'
      }, { status: 500 });
    } else {
      return HttpResponse.json({
        success: false,
        message: 'E-mail ou senha inválidos'
      }, { status: 401 });
    }
  }),

  http.post('*/api/auth/register', async ({ request }) => {
    const body = await request.json() as { name: string; email: string };
    return HttpResponse.json({
      success: true,
      data: {
        user: {
          id: 'user456',
          name: body.name,
          email: body.email,
          role: 'dentist'
        },
        accessToken: 'new-access-token',
        refreshToken: 'new-refresh-token'
      }
    });
  }),

  http.get('*/api/auth/me', () => {
    return HttpResponse.json({
      success: true,
      data: {
        id: 'user123',
        name: 'Current User',
        email: 'current@example.com',
        role: 'admin'
      }
    });
  }),

  http.get('*/api/patients', () => {
    return HttpResponse.json({
      success: true,
      data: [
        {
          id: 'patient1',
          firstName: 'João',
          lastName: 'Silva',
          email: 'joao@example.com'
        },
        {
          id: 'patient2',
          firstName: 'Maria',
          lastName: 'Santos',
          email: 'maria@example.com'
        }
      ]
    });
  }),

  http.get('*/api/patients/:id', ({ params }) => {
    const { id } = params;
    if (id === 'non-existent-id') {
      return HttpResponse.json({
        success: false,
        message: 'Paciente não encontrado'
      }, { status: 404 });
    }

    return HttpResponse.json({
      success: true,
      data: {
        _id: id,
        id: id,
        firstName: 'João',
        lastName: 'Silva',
        email: 'joao@example.com',
        phone: '(11) 99999-9999'
      }
    });
  }),

  http.post('*/api/patients', async ({ request }) => {
    const body = await request.json() as { name: string; email: string; phone: string };
    return HttpResponse.json({
      success: true,
      data: {
        id: 'new-patient-id',
        name: body.name,
        email: body.email,
        phone: body.phone,
        firstName: 'New',
        lastName: 'Patient',
        fullName: 'New Patient'
      }
    });
  }),

  http.patch('*/api/patients/:id', async ({ request }) => {
    const body = await request.json() as { firstName?: string; lastName?: string; phone?: string };
    return HttpResponse.json({
      success: true,
      data: {
        id: 'patient123',
        firstName: body.firstName || 'Updated',
        lastName: body.lastName || 'Name',
        phone: body.phone,
        fullName: `${body.firstName || 'Updated'} ${body.lastName || 'Name'}`
      }
    });
  }),

  http.delete('*/api/patients/:id', () => {
    return HttpResponse.json({
      success: true,
      message: 'Paciente removido com sucesso'
    });
  }),

  http.get('*/api/admin/contacts', () => {
    return HttpResponse.json({
      success: true,
      data: {
        contacts: [
          { id: 'contact1', name: 'John Doe', email: 'john@example.com', clinic: 'Test Clinic', phone: '123456789', specialty: 'General', status: 'new', createdAt: new Date().toISOString() },
          { id: 'contact2', name: 'Jane Doe', email: 'jane@example.com', clinic: 'Test Clinic 2', phone: '987654321', specialty: 'Orthodontics', status: 'contacted', createdAt: new Date().toISOString() }
        ],
        total: 2,
        page: 1,
        pages: 1,
        limit: 10
      }
    });
  }),

  http.post('*/api/admin/contacts', async ({ request }) => {
    const body = await request.json() as { name: string; email: string };
    return HttpResponse.json({
      success: true,
      data: {
        id: 'new-contact-id',
        name: body.name,
        email: body.email
      }
    });
  }),

  http.get('*/api/appointments', () => {
    return HttpResponse.json({
      success: true,
      data: [
        {
          id: 'appt1',
          patient: 'patient1',
          provider: 'provider1',
          status: 'scheduled'
        }
      ]
    });
  }),

  http.post('*/api/appointments', async ({ request }) => {
    const body = await request.json() as { patient: string; provider: string; status: string };
    return HttpResponse.json({
      success: true,
      data: {
        id: 'new-appt-id',
        patient: body.patient,
        provider: body.provider,
        status: body.status
      }
    });
  }),

  http.get('*/api/dashboard/stats', () => {
    return HttpResponse.json({
      success: true,
      data: {
        totalPatients: 1247,
        todayAppointments: 12,
        monthlyRevenue: 45680,
        satisfaction: 4.8
      }
    });
  }),

  http.post('*/api/public/contact', async ({ request }) => {
    const body = await request.json() as any;
    return HttpResponse.json({
      success: true,
      data: {
        id: 'contact-form-id',
        protocol: 'PROTOCOL-123',
        estimatedResponse: '2 horas'
      }
    });
  }),

  http.get('*/api/health', () => {
    return HttpResponse.json({
      success: true,
      data: {
        timestamp: new Date().toISOString(),
        uptime: 123456,
        database: 'connected',
        memory: { used: 100, total: 1000 },
        environment: 'test',
        version: '1.0.0'
      }
    });
  }),

  http.post('*/api/patient-auth/logout', () => {
    return HttpResponse.json({ success: true });
  }),

  http.get('*/api/patient-auth/me', () => {
    return HttpResponse.json({
      success: true,
      data: {
        id: 'user1',
        patient: { id: 'patient1', name: 'John Doe', phone: '123456789' },
        email: 'john@example.com',
        isActive: true,
        emailVerified: true
      }
    });
  }),
];
