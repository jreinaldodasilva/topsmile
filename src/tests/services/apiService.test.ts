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
      const mockResponse = {
        ok: true,
        data: [{ _id: '1', name: 'John Doe' }]
      };
      mockRequest.mockResolvedValueOnce(mockResponse);

      const result = await apiService.patients.getAll();
      
      expect(mockRequest).toHaveBeenCalledWith('/api/patients');
      expect(result).toEqual(mockResponse);
    });

    it('getAll should handle query parameters', async () => {
      const mockResponse = {
        ok: true,
        data: [{ _id: '1', name: 'John Doe' }]
      };
      mockRequest.mockResolvedValueOnce(mockResponse);

      const params = { search: 'john', limit: 10 };
      const result = await apiService.patients.getAll(params);
      
      expect(mockRequest).toHaveBeenCalledWith('/api/patients?search=john&limit=10');
      expect(result).toEqual(mockResponse);
    });

    it('getOne should get patient by ID', async () => {
      const mockResponse = {
        ok: true,
        data: { _id: '123', name: 'John Doe' }
      };
      mockRequest.mockResolvedValueOnce(mockResponse);

      const result = await apiService.patients.getOne('123');
      
      expect(mockRequest).toHaveBeenCalledWith('/api/patients/123');
      expect(result).toEqual(mockResponse);
    });

    it('getOne should handle non-existent patient', async () => {
      const mockResponse = {
        ok: false,
        status: 404,
        message: 'Patient not found'
      };
      mockRequest.mockResolvedValueOnce(mockResponse);

      const result = await apiService.patients.getOne('non-existent');
      
      expect(result).toEqual(mockResponse);
    });

    it('create should create a new patient', async () => {
      const patientData = { firstName: 'New', lastName: 'Patient', email: 'new@example.com', phone: '123456789', address: { street: 'Street', number: '1', neighborhood: 'Neighborhood', city: 'City', state: 'State', zipCode: '12345' } };
      const mockResponse = {
        ok: true,
        data: { _id: 'new-id', ...patientData }
      };
      mockRequest.mockResolvedValueOnce(mockResponse);

      const result = await apiService.patients.create(patientData);
      
      expect(mockRequest).toHaveBeenCalledWith('/api/patients', {
        method: 'POST',
        body: JSON.stringify(patientData)
      });
      expect(result).toEqual(mockResponse);
    });

    it('update should update patient data', async () => {
      const updates = { name: 'Updated Name' };
      const mockResponse = {
        ok: true,
        data: { _id: '123', name: 'Updated Name' }
      };
      mockRequest.mockResolvedValueOnce(mockResponse);

      const result = await apiService.patients.update('123', updates);
      
      expect(mockRequest).toHaveBeenCalledWith('/api/patients/123', {
        method: 'PATCH',
        body: JSON.stringify(updates)
      });
      expect(result).toEqual(mockResponse);
    });

    it('delete should delete patient', async () => {
      const mockResponse = {
        ok: true,
        message: 'Patient deleted successfully'
      };
      mockRequest.mockResolvedValueOnce(mockResponse);

      const result = await apiService.patients.delete('123');
      
      expect(mockRequest).toHaveBeenCalledWith('/api/patients/123', {
        method: 'DELETE'
      });
      expect(result).toEqual(mockResponse);
    });
  });

  // Similar patterns for other service methods...
  describe('contacts methods', () => {
    it('getAll should get all contacts', async () => {
      const mockResponse = {
        ok: true,
        data: { contacts: [], total: 0 }
      };
      mockRequest.mockResolvedValueOnce(mockResponse);

      const result = await apiService.contacts.getAll();
      expect(result).toEqual(mockResponse);
    });

    it('create should create a new contact', async () => {
      const contactData = { name: 'New Contact', email: 'contact@example.com' };
      const mockResponse = {
        ok: true,
        data: { _id: 'new-contact-id', ...contactData }
      };
      mockRequest.mockResolvedValueOnce(mockResponse);

      const result = await apiService.contacts.create(contactData);
      expect(result).toEqual(mockResponse);
    });
  });

  describe('appointments methods', () => {
    it('getAll should get all appointments', async () => {
      const mockResponse = {
        ok: true,
        data: []
      };
      mockRequest.mockResolvedValueOnce(mockResponse);

      const result = await apiService.appointments.getAll();
      expect(result).toEqual(mockResponse);
    });
  });
});
