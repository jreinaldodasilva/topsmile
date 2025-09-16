import { http, HttpResponse } from 'msw';

export const handlers = [
  http.get('*/api/admin/contacts', () => {
    return HttpResponse.json([
      {
        id: '1',
        name: 'Test Contact',
        email: 'test@example.com',
        clinic: 'Test Clinic',
        phone: '1234567890',
        specialty: 'Test Specialty',
        status: 'new',
        createdAt: new Date().toISOString(),
      },
    ]);
  }),
];
