import { http, HttpResponse } from 'msw';

export const handlers = [
  // Dashboard endpoint with comprehensive mock data
  http.get('*/api/admin/dashboard', () => {
    return HttpResponse.json({
      success: true,
      data: {
        contacts: {
          total: 150,
          byStatus: [
            { _id: 'new', count: 45 },
            { _id: 'contacted', count: 30 },
            { _id: 'qualified', count: 25 },
            { _id: 'converted', count: 20 },
            { _id: 'closed', count: 30 }
          ],
          bySource: [
            { _id: 'website_contact_form', count: 60 },
            { _id: 'phone', count: 30 },
            { _id: 'referral', count: 25 },
            { _id: 'social_media', count: 35 }
          ],
          recentCount: 12
        },
        summary: {
          totalContacts: 150,
          newThisWeek: 25,
          conversionRate: 18,
          revenue: 'R$ 25.480'
        },
        user: {
          name: 'Admin User',
          role: 'admin',
          clinicId: 'clinic-123'
        }
      }
    });
  }),

  // Enhanced contacts endpoint
  http.get('*/api/admin/contacts', () => {
    return HttpResponse.json({
      success: true,
      data: {
        contacts: [
          {
            _id: 'contact1',
            name: 'John Doe',
            email: 'john@example.com',
            phone: '(11) 99999-9999',
            status: 'new',
            source: 'website_contact_form',
            createdAt: '2023-01-01T10:00:00Z'
          },
          {
            _id: 'contact2',
            name: 'Jane Smith',
            email: 'jane@example.com',
            phone: '(11) 88888-8888',
            status: 'contacted',
            source: 'phone',
            createdAt: '2023-01-02T10:00:00Z'
          }
        ],
        total: 2
      }
    });
  }),

  // Provider management endpoints
  http.get('*/api/providers', () => {
    return HttpResponse.json({
      success: true,
      data: [
        {
          _id: 'provider1',
          name: 'Dr. Smith',
          specialization: 'General',
          email: 'drsmith@example.com',
          phone: '(11) 99999-0001'
        },
        {
          _id: 'provider2',
          name: 'Dr. Johnson',
          specialization: 'Orthodontics',
          email: 'drjohnson@example.com',
          phone: '(11) 99999-0002'
        }
      ]
    });
  }),

  // Appointment types
  http.get('*/api/appointment-types', () => {
    return HttpResponse.json({
      success: true,
      data: [
        { _id: 'type1', name: 'Consultation', duration: 30 },
        { _id: 'type2', name: 'Cleaning', duration: 45 }
      ]
    });
  }),

  // Available time slots
  http.get('*/api/appointments/available-slots', () => {
    return HttpResponse.json({
      success: true,
      data: [
        { time: '09:00', available: true },
        { time: '10:00', available: true },
        { time: '11:00', available: false },
        { time: '14:00', available: true }
      ]
    });
  }),

  // Patients endpoints
  http.get('*/api/patients', () => {
    return HttpResponse.json({
      success: true,
      data: {
        patients: [],
        total: 0
      }
    });
  }),

  // Appointments endpoint
  http.get('*/api/appointments', () => {
    return HttpResponse.json({
      success: true,
      data: {
        appointments: [],
        total: 0
      }
    });
  }),

  // Auth endpoints
  http.post('*/api/auth/login', async ({ request }) => {
    const body = await request.json() as { email: string; password: string };
    if (body.email === 'admin@topsmile.com' && body.password === 'SecurePass123!') {
      return HttpResponse.json({
        success: true,
        data: {
          user: {
            _id: 'user123',
            name: 'Admin User',
            email: 'admin@topsmile.com',
            role: 'admin'
          },
          accessToken: 'mock-access-token',
          refreshToken: 'mock-refresh-token'
        }
      });
    } else {
      return HttpResponse.json({
        success: false,
        message: 'E-mail ou senha inválidos'
      }, { status: 401 });
    }
  }),

  http.get('*/api/auth/me', () => {
    return HttpResponse.json({
      success: true,
      data: {
        _id: 'user123',
        name: 'Current User',
        email: 'current@example.com',
        role: 'admin'
      }
    });
  }),

  // Token refresh endpoint
  http.post('*/api/auth/refresh', () => {
    return HttpResponse.json({
      success: true,
      data: {
        accessToken: 'new-access-token',
        refreshToken: 'new-refresh-token'
      }
    });
  }),

  // Logout endpoint
  http.post('*/api/auth/logout', () => {
    return HttpResponse.json({
      success: true,
      message: 'Logged out successfully'
    });
  }),

  // Other endpoints...
  http.post('*/api/contact', () => {
    return HttpResponse.json({
      success: true,
      data: { id: 'contact-form-id', protocol: 'PROTOCOL-123' }
    });
  }),

  http.get('*/api/health', () => {
    return HttpResponse.json({
      success: true,
      data: {
        timestamp: new Date().toISOString(),
        uptime: 123456,
        database: 'connected',
        environment: 'test',
        version: '1.0.0'
      }
    });
  })
];
