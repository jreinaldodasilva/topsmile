import { apiService } from '../../services/apiService';

// Mock the http service
jest.mock('../../services/http', () => ({
  request: jest.fn(),
  logout: jest.fn()
}));

const mockRequest = require('../../services/http').request;

describe('apiService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('auth methods', () => {
    it('login should handle network errors', async () => {
      mockRequest.mockRejectedValueOnce(new Error('Network request failed'));

      await expect(
        apiService.auth.login('test@example.com', 'password')
      ).rejects.toThrow('Network request failed');
    });
  });

  describe('patients methods', () => {
    it('getAll should get all patients', async () => {
      const mockHttpResponse = {
        ok: true,
        status: 200,
        data: [{ _id: '1', name: 'John Doe' }],
        message: undefined
      };
      mockRequest.mockResolvedValueOnce(mockHttpResponse);

      const result = await apiService.patients.getAll();

      expect(mockRequest).toHaveBeenCalledWith('/api/patients');
      expect(result).toEqual({
        success: true,
        data: [{ _id: '1', name: 'John Doe' }],
        message: undefined
      });
    });

    it('getAll should handle query parameters', async () => {
      const mockHttpResponse = {
        ok: true,
        status: 200,
        data: [{ _id: '1', name: 'John Doe' }],
        message: undefined
      };
      mockRequest.mockResolvedValueOnce(mockHttpResponse);

      const params = { search: 'john', limit: 10 };
      const result = await apiService.patients.getAll(params);

      expect(mockRequest).toHaveBeenCalledWith('/api/patients?search=john&limit=10');
      expect(result).toEqual({
        success: true,
        data: [{ _id: '1', name: 'John Doe' }],
        message: undefined
      });
    });

    it('getOne should get patient by ID', async () => {
      const mockHttpResponse = {
        ok: true,
        status: 200,
        data: { _id: '123', name: 'John Doe' },
        message: undefined
      };
      mockRequest.mockResolvedValueOnce(mockHttpResponse);

      const result = await apiService.patients.getOne('123');

      expect(mockRequest).toHaveBeenCalledWith('/api/patients/123');
      expect(result).toEqual({
        success: true,
        data: { _id: '123', name: 'John Doe' },
        message: undefined
      });
    });

    it('getOne should handle non-existent patient', async () => {
      const mockHttpResponse = {
        ok: false,
        status: 404,
        data: undefined,
        message: 'Patient not found'
      };
      mockRequest.mockResolvedValueOnce(mockHttpResponse);

      const result = await apiService.patients.getOne('non-existent');

      expect(result).toEqual({
        success: false,
        data: undefined,
        message: 'Patient not found'
      });
    });

    it('create should create a new patient', async () => {
      const patientData = { firstName: 'New', lastName: 'Patient', email: 'new@example.com', phone: '123456789', address: { street: 'Street', number: '1', neighborhood: 'Neighborhood', city: 'City', state: 'State', zipCode: '12345' } };
      const mockHttpResponse = {
        ok: true,
        status: 201,
        data: { _id: 'new-id', firstName: 'New', lastName: 'Patient', fullName: 'New Patient', phone: '123456789' },
        message: undefined
      };
      mockRequest.mockResolvedValueOnce(mockHttpResponse);

      const result = await apiService.patients.create(patientData);

      expect(mockRequest).toHaveBeenCalledWith('/api/patients', {
        method: 'POST',
        body: JSON.stringify({
          name: 'New Patient',
          email: 'new@example.com',
          phone: undefined,
          birthDate: undefined,
          gender: undefined,
          cpf: undefined,
          address: undefined,
          emergencyContact: undefined,
          medicalHistory: undefined
        })
      });
      expect(result).toEqual({
        success: true,
        data: { _id: 'new-id', firstName: 'New', lastName: 'Patient', fullName: 'New Patient', phone: '123456789' },
        message: undefined
      });
    });

    it('update should update patient data', async () => {
      const updates = { firstName: 'Updated', lastName: 'Name' };
      const mockHttpResponse = {
        ok: true,
        status: 200,
        data: { _id: '123', firstName: 'Updated', lastName: 'Name' },
        message: undefined
      };
      mockRequest.mockResolvedValueOnce(mockHttpResponse);

      const result = await apiService.patients.update('123', updates);

      expect(mockRequest).toHaveBeenCalledWith('/api/patients/123', {
        method: 'PATCH',
        body: JSON.stringify({
          name: 'Updated Name',
          email: undefined,
          phone: undefined,
          birthDate: undefined,
          gender: undefined,
          cpf: undefined,
          address: undefined,
          emergencyContact: undefined,
          medicalHistory: undefined
        })
      });
      expect(result).toEqual({
        success: true,
        data: { _id: '123', firstName: 'Updated', lastName: 'Name' },
        message: undefined
      });
    });

    it('delete should delete patient', async () => {
      const mockHttpResponse = {
        ok: true,
        status: 200,
        data: undefined,
        message: 'Patient deleted successfully'
      };
      mockRequest.mockResolvedValueOnce(mockHttpResponse);

      const result = await apiService.patients.delete('123');

      expect(mockRequest).toHaveBeenCalledWith('/api/patients/123', {
        method: 'DELETE'
      });
      expect(result).toEqual({
        success: true,
        data: undefined,
        message: 'Patient deleted successfully'
      });
    });
  });

  describe('contacts methods', () => {
    it('getAll should get all contacts', async () => {
      const mockHttpResponse = {
        ok: true,
        status: 200,
        data: { contacts: [], total: 0 },
        message: undefined
      };
      mockRequest.mockResolvedValueOnce(mockHttpResponse);

      const result = await apiService.contacts.getAll();
      expect(result).toEqual({
        success: true,
        data: { contacts: [], total: 0 },
        message: undefined
      });
    });

    it('create should create a new contact', async () => {
      const contactData = { name: 'New Contact', email: 'contact@example.com' };
      const mockHttpResponse = {
        ok: true,
        status: 201,
        data: { _id: 'new-contact-id', ...contactData },
        message: undefined
      };
      mockRequest.mockResolvedValueOnce(mockHttpResponse);

      const result = await apiService.contacts.create(contactData);
      expect(result).toEqual({
        success: true,
        data: { _id: 'new-contact-id', ...contactData },
        message: undefined
      });
    });
  });

  describe('appointments methods', () => {
    it('getAll should get all appointments', async () => {
      const mockHttpResponse = {
        ok: true,
        status: 200,
        data: [],
        message: undefined
      };
      mockRequest.mockResolvedValueOnce(mockHttpResponse);

      const result = await apiService.appointments.getAll();
      expect(result).toEqual({
        success: true,
        data: [],
        message: undefined
      });
    });

    it('create should create a new appointment', async () => {
      const appointmentData = {
        patient: 'patient1',
        provider: 'provider1',
        clinic: 'clinic1',
        appointmentType: 'type1',
        scheduledStart: '2023-12-01T10:00:00Z',
        scheduledEnd: '2023-12-01T11:00:00Z',
        status: 'scheduled',
        notes: 'Test appointment',
        price: 100,
        paymentStatus: 'pending',
        priority: 'normal',
        preferredContactMethod: 'phone',
        syncStatus: 'pending'
      };
      const mockHttpResponse = {
        ok: true,
        status: 201,
        data: { _id: 'new-appt-id', ...appointmentData },
        message: undefined
      };
      mockRequest.mockResolvedValueOnce(mockHttpResponse);

      const result = await apiService.appointments.create(appointmentData as any);
      expect(result).toEqual({
        success: true,
        data: { _id: 'new-appt-id', ...appointmentData },
        message: undefined
      });
    });
  });

  describe('dashboard methods', () => {
    it('getStats should get dashboard statistics', async () => {
      const mockHttpResponse = {
        ok: true,
        status: 200,
        data: {
          contacts: { total: 100 },
          summary: { totalContacts: 100, newThisWeek: 10 }
        },
        message: undefined
      };
      mockRequest.mockResolvedValueOnce(mockHttpResponse);

      const result = await apiService.dashboard.getStats();
      expect(result).toEqual({
        success: true,
        data: {
          contacts: { total: 100 },
          summary: { totalContacts: 100, newThisWeek: 10 }
        },
        message: undefined
      });
    });
  });

  describe('public methods', () => {
    it('sendContactForm should send contact form successfully', async () => {
      const formData = { name: 'John', email: 'john@example.com', clinic: 'Test Clinic', specialty: 'General', phone: '123456789' };
      const mockHttpResponse = {
        ok: true,
        status: 200,
        data: { id: 'contact-id', protocol: 'PROTOCOL-123' },
        message: undefined
      };
      mockRequest.mockResolvedValueOnce(mockHttpResponse);

      const result = await apiService.public.sendContactForm(formData);
      expect(result).toEqual({
        success: true,
        data: { id: 'contact-id', protocol: 'PROTOCOL-123' },
        message: undefined
      });
    });
  });

  describe('system methods', () => {
    it('health should get health status', async () => {
      const mockHttpResponse = {
        ok: true,
        status: 200,
        data: { status: 'healthy', timestamp: '2023-01-01T00:00:00Z' },
        message: undefined
      };
      mockRequest.mockResolvedValueOnce(mockHttpResponse);

      const result = await apiService.system.health();
      expect(result).toEqual({
        success: true,
        data: { status: 'healthy', timestamp: '2023-01-01T00:00:00Z' },
        message: undefined
      });
    });
  });
});
