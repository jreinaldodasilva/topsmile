import { patientService } from '../../../../src/services/patient/patientService';
import { Patient } from '../../../../src/models/Patient';

jest.mock('../../../../src/models/Patient');

describe('PatientService', () => {
  const mockClinicId = 'clinic123';
  
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createPatient', () => {
    it('should create patient with valid data', async () => {
      const patientData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        phone: '1234567890',
        clinic: mockClinicId
      };

      const mockPatient = { _id: 'patient123', ...patientData, save: jest.fn().mockResolvedValue(true) };
      (Patient.findOne as jest.Mock).mockResolvedValue(null);
      (Patient as any).mockImplementation(() => mockPatient);

      const result = await patientService.createPatient(patientData);

      expect(result).toHaveProperty('_id');
      expect(Patient.findOne).toHaveBeenCalledWith({ email: patientData.email, clinic: mockClinicId });
    });

    it('should throw error for duplicate email', async () => {
      const patientData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'existing@example.com',
        phone: '1234567890',
        clinic: mockClinicId
      };

      (Patient.findOne as jest.Mock).mockResolvedValue({ email: patientData.email });

      await expect(patientService.createPatient(patientData))
        .rejects.toThrow('E-mail já cadastrado');
    });
  });

  describe('getPatientById', () => {
    it('should return patient by id', async () => {
      const mockPatient = {
        _id: 'patient123',
        firstName: 'John',
        lastName: 'Doe',
        clinic: mockClinicId
      };

      (Patient.findOne as jest.Mock).mockResolvedValue(mockPatient);

      const result = await patientService.getPatientById('patient123', mockClinicId);

      expect(result).toEqual(mockPatient);
      expect(Patient.findOne).toHaveBeenCalledWith({ _id: 'patient123', clinic: mockClinicId });
    });

    it('should return null for non-existent patient', async () => {
      (Patient.findOne as jest.Mock).mockResolvedValue(null);

      const result = await patientService.getPatientById('nonexistent', mockClinicId);

      expect(result).toBeNull();
    });
  });

  describe('searchPatients', () => {
    it('should search patients with filters', async () => {
      const mockPatients = [
        { _id: 'p1', firstName: 'John', lastName: 'Doe' },
        { _id: 'p2', firstName: 'Jane', lastName: 'Smith' }
      ];

      const mockQuery = {
        limit: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        sort: jest.fn().mockReturnThis(),
        lean: jest.fn().mockResolvedValue(mockPatients)
      };

      (Patient.find as jest.Mock).mockReturnValue(mockQuery);
      (Patient.countDocuments as jest.Mock).mockResolvedValue(2);

      const result = await patientService.searchPatients({
        clinicId: mockClinicId,
        search: 'John',
        page: 1,
        limit: 10
      });

      expect(result.patients).toHaveLength(2);
      expect(result.total).toBe(2);
      expect(Patient.find).toHaveBeenCalled();
    });
  });

  describe('updatePatient', () => {
    it('should update patient data', async () => {
      const updateData = { phone: '9876543210' };
      const mockPatient = {
        _id: 'patient123',
        firstName: 'John',
        ...updateData,
        save: jest.fn().mockResolvedValue(true)
      };

      (Patient.findOne as jest.Mock).mockResolvedValue(mockPatient);

      const result = await patientService.updatePatient('patient123', mockClinicId, updateData);

      expect(result.phone).toBe(updateData.phone);
      expect(mockPatient.save).toHaveBeenCalled();
    });
  });

  describe('deletePatient', () => {
    it('should soft delete patient', async () => {
      const mockPatient = {
        _id: 'patient123',
        status: 'active',
        save: jest.fn().mockResolvedValue(true)
      };

      (Patient.findOne as jest.Mock).mockResolvedValue(mockPatient);

      const result = await patientService.deletePatient('patient123', mockClinicId);

      expect(result).toBe(true);
      expect(mockPatient.status).toBe('inactive');
      expect(mockPatient.save).toHaveBeenCalled();
    });
  });
});
