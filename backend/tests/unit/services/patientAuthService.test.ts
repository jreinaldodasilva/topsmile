import { patientAuthService } from '../../../src/services/patientAuthService';
import { PatientUser } from '../../../src/models/PatientUser';
import { Patient } from '../../../src/models/Patient';
import { PatientRefreshToken } from '../../../src/models/PatientRefreshToken';
import { createTestClinic } from '../../testHelpers';
import { ValidationError, UnauthorizedError, ConflictError, NotFoundError } from '../../../src/types/errors';

describe('PatientAuthService', () => {
  let testClinic: any;

  beforeEach(async () => {
    testClinic = await createTestClinic();
  });

  describe('register', () => {
    it('should register a new patient user successfully', async () => {
      const registrationData = {
        name: 'João Silva',
        email: 'joao@example.com',
        phone: '(11) 99999-9999',
        password: 'SecurePass123!',
        clinicId: testClinic._id.toString(),
        birthDate: new Date('1990-01-01'),
        gender: 'male' as const
      };

      const result = await patientAuthService.register(registrationData);

      expect(result.success).toBe(true);
      expect(result.data.patient).toBeDefined();
      expect(result.data.patientUser).toBeDefined();
      expect(result.data.accessToken).toBeDefined();
      expect(result.data.refreshToken).toBeDefined();
      expect(result.data.patient.name).toBe(registrationData.name);
      expect(result.data.patientUser.email).toBe(registrationData.email);
      expect(result.data.requiresEmailVerification).toBe(true);
    });

    it('should link to existing patient when patientId is provided', async () => {
      // Create existing patient
      const existingPatient = new Patient({
        name: 'Maria Santos',
        email: 'maria@example.com',
        phone: '(11) 88888-8888',
        clinic: testClinic._id,
        status: 'active'
      });
      await existingPatient.save();

      const registrationData = {
        patientId: existingPatient._id.toString(),
        name: 'Maria Santos',
        email: 'maria.portal@example.com',
        phone: '(11) 88888-8888',
        password: 'SecurePass123!',
        clinicId: testClinic._id.toString()
      };

      const result = await patientAuthService.register(registrationData);

      expect(result.success).toBe(true);
      expect(result.data.patient._id.toString()).toBe(existingPatient._id.toString());
      expect(result.data.patientUser.email).toBe(registrationData.email);
    });

    it('should throw error for duplicate email', async () => {
      const registrationData = {
        name: 'Test User',
        email: 'duplicate@example.com',
        phone: '(11) 99999-9999',
        password: 'SecurePass123!',
        clinicId: testClinic._id.toString()
      };

      await patientAuthService.register(registrationData);

      await expect(patientAuthService.register(registrationData))
        .rejects.toThrow(ConflictError);
    });

    it('should throw error for invalid data', async () => {
      const invalidData = {
        name: '',
        email: 'invalid-email',
        phone: '',
        password: '123',
        clinicId: testClinic._id.toString()
      };

      await expect(patientAuthService.register(invalidData))
        .rejects.toThrow(ValidationError);
    });
  });

  describe('login', () => {
    let testPatientUser: any;
    let testPatient: any;

    beforeEach(async () => {
      const registrationData = {
        name: 'Login Test',
        email: 'login@example.com',
        phone: '(11) 99999-9999',
        password: 'LoginPass123!',
        clinicId: testClinic._id.toString()
      };

      const result = await patientAuthService.register(registrationData);
      testPatientUser = result.data.patientUser;
      testPatient = result.data.patient;
    });

    it('should login with correct credentials', async () => {
      const loginData = {
        email: 'login@example.com',
        password: 'LoginPass123!'
      };

      const result = await patientAuthService.login(loginData);

      expect(result.success).toBe(true);
      expect(result.data.patient._id.toString()).toBe(testPatient._id.toString());
      expect(result.data.patientUser._id.toString()).toBe(testPatientUser._id.toString());
      expect(result.data.accessToken).toBeDefined();
      expect(result.data.refreshToken).toBeDefined();
    });

    it('should throw error for invalid email', async () => {
      const loginData = {
        email: 'nonexistent@example.com',
        password: 'LoginPass123!'
      };

      await expect(patientAuthService.login(loginData))
        .rejects.toThrow(UnauthorizedError);
    });

    it('should throw error for invalid password', async () => {
      const loginData = {
        email: 'login@example.com',
        password: 'WrongPassword123!'
      };

      await expect(patientAuthService.login(loginData))
        .rejects.toThrow(UnauthorizedError);
    });

    it('should handle account lockout after failed attempts', async () => {
      const loginData = {
        email: 'login@example.com',
        password: 'WrongPassword123!'
      };

      // Attempt multiple failed logins
      for (let i = 0; i < 5; i++) {
        try {
          await patientAuthService.login(loginData);
        } catch (error) {
          // Expected to fail
        }
      }

      // Account should be locked now
      await expect(patientAuthService.login({
        email: 'login@example.com',
        password: 'LoginPass123!' // Even correct password should fail
      })).rejects.toThrow(UnauthorizedError);
    });
  });

  describe('refreshAccessToken', () => {
    let refreshToken: string;
    let patientUser: any;

    beforeEach(async () => {
      const registrationData = {
        name: 'Refresh Test',
        email: 'refresh@example.com',
        phone: '(11) 99999-9999',
        password: 'RefreshPass123!',
        clinicId: testClinic._id.toString()
      };

      const result = await patientAuthService.register(registrationData);
      refreshToken = result.data.refreshToken;
      patientUser = result.data.patientUser;
    });

    it('should refresh access token with valid refresh token', async () => {
      const result = await patientAuthService.refreshAccessToken(refreshToken);

      expect(result.accessToken).toBeDefined();
      expect(result.expiresIn).toBeDefined();
    });

    it('should throw error for invalid refresh token', async () => {
      await expect(patientAuthService.refreshAccessToken('invalid-token'))
        .rejects.toThrow(UnauthorizedError);
    });

    it('should revoke used refresh token (token rotation)', async () => {
      await patientAuthService.refreshAccessToken(refreshToken);

      // Try to use the same token again
      await expect(patientAuthService.refreshAccessToken(refreshToken))
        .rejects.toThrow(UnauthorizedError);
    });
  });

  describe('updateProfile', () => {
    let testPatient: any;

    beforeEach(async () => {
      const registrationData = {
        name: 'Profile Test',
        email: 'profile@example.com',
        phone: '(11) 99999-9999',
        password: 'ProfilePass123!',
        clinicId: testClinic._id.toString()
      };

      const result = await patientAuthService.register(registrationData);
      testPatient = result.data.patient;
    });

    it('should update patient profile successfully', async () => {
      const updates = {
        name: 'Updated Name',
        phone: '(11) 88888-8888',
        birthDate: new Date('1985-05-15')
      };

      const updatedPatient = await patientAuthService.updateProfile(
        testPatient._id.toString(),
        updates
      );

      expect(updatedPatient.name).toBe(updates.name);
      expect(updatedPatient.phone).toBe(updates.phone);
      expect(updatedPatient.birthDate).toEqual(updates.birthDate);
    });

    it('should throw error for non-existent patient', async () => {
      const updates = { name: 'Updated Name' };

      await expect(patientAuthService.updateProfile('507f1f77bcf86cd799439011', updates))
        .rejects.toThrow(NotFoundError);
    });
  });

  describe('changePassword', () => {
    let testPatientUser: any;

    beforeEach(async () => {
      const registrationData = {
        name: 'Password Test',
        email: 'password@example.com',
        phone: '(11) 99999-9999',
        password: 'OldPass123!',
        clinicId: testClinic._id.toString()
      };

      const result = await patientAuthService.register(registrationData);
      testPatientUser = result.data.patientUser;
    });

    it('should change password successfully', async () => {
      await expect(patientAuthService.changePassword(
        testPatientUser._id.toString(),
        'OldPass123!',
        'NewPass123!'
      )).resolves.not.toThrow();

      // Verify new password works
      const loginResult = await patientAuthService.login({
        email: 'password@example.com',
        password: 'NewPass123!'
      });

      expect(loginResult.success).toBe(true);
    });

    it('should throw error for incorrect current password', async () => {
      await expect(patientAuthService.changePassword(
        testPatientUser._id.toString(),
        'WrongPass123!',
        'NewPass123!'
      )).rejects.toThrow(UnauthorizedError);
    });
  });

  describe('logout', () => {
    let refreshToken: string;

    beforeEach(async () => {
      const registrationData = {
        name: 'Logout Test',
        email: 'logout@example.com',
        phone: '(11) 99999-9999',
        password: 'LogoutPass123!',
        clinicId: testClinic._id.toString()
      };

      const result = await patientAuthService.register(registrationData);
      refreshToken = result.data.refreshToken;
    });

    it('should logout successfully and revoke refresh token', async () => {
      await expect(patientAuthService.logout(refreshToken)).resolves.not.toThrow();

      // Token should be revoked
      await expect(patientAuthService.refreshAccessToken(refreshToken))
        .rejects.toThrow(UnauthorizedError);
    });

    it('should handle logout with invalid token gracefully', async () => {
      await expect(patientAuthService.logout('invalid-token')).resolves.not.toThrow();
    });
  });

  describe('verifyToken', () => {
    let accessToken: string;

    beforeEach(async () => {
      const registrationData = {
        name: 'Token Test',
        email: 'token@example.com',
        phone: '(11) 99999-9999',
        password: 'TokenPass123!',
        clinicId: testClinic._id.toString()
      };

      const result = await patientAuthService.register(registrationData);
      accessToken = result.data.accessToken;
    });

    it('should verify valid token successfully', async () => {
      const payload = await patientAuthService.verifyToken(accessToken);

      expect(payload.type).toBe('patient');
      expect(payload.email).toBe('token@example.com');
      expect(payload.patientUserId).toBeDefined();
      expect(payload.patientId).toBeDefined();
      expect(payload.clinicId).toBeDefined();
    });

    it('should throw error for invalid token', async () => {
      await expect(patientAuthService.verifyToken('invalid-token'))
        .rejects.toThrow(UnauthorizedError);
    });
  });

  describe('deleteAccount', () => {
    let testPatientUser: any;

    beforeEach(async () => {
      const registrationData = {
        name: 'Delete Test',
        email: 'delete@example.com',
        phone: '(11) 99999-9999',
        password: 'DeletePass123!',
        clinicId: testClinic._id.toString()
      };

      const result = await patientAuthService.register(registrationData);
      testPatientUser = result.data.patientUser;
    });

    it('should delete account successfully', async () => {
      await expect(patientAuthService.deleteAccount(
        testPatientUser._id.toString(),
        'DeletePass123!'
      )).resolves.not.toThrow();

      // Verify account is deleted
      const deletedUser = await PatientUser.findById(testPatientUser._id);
      expect(deletedUser).toBeNull();
    });

    it('should throw error for incorrect password', async () => {
      await expect(patientAuthService.deleteAccount(
        testPatientUser._id.toString(),
        'WrongPass123!'
      )).rejects.toThrow(UnauthorizedError);
    });
  });
});