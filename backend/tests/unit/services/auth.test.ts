import { authService } from '../../../src/services/authService';
import { createTestClinic, createTestUser } from '../../helpers/factories';

describe('AuthService', () => {
  let testClinic: any;

  beforeEach(async () => {
    testClinic = await createTestClinic();
  });

  describe('login', () => {
    it('should authenticate valid user', async () => {
      const user = await createTestUser(testClinic, {
        email: 'test@example.com',
        password: 'Password123!'
      });

      const result = await authService.login('test@example.com', 'Password123!');
      
      expect(result.accessToken).toBeDefined();
      expect(result.user.email).toBe('test@example.com');
    });

    it('should reject invalid password', async () => {
      await createTestUser(testClinic, {
        email: 'test@example.com',
        password: 'Password123!'
      });

      await expect(
        authService.login('test@example.com', 'WrongPassword')
      ).rejects.toThrow();
    });
  });

  describe('validateToken', () => {
    it('should validate valid token', async () => {
      const user = await createTestUser(testClinic);
      const { accessToken } = await authService.login(user.email, 'Password123!');
      
      const decoded = authService.validateToken(accessToken);
      
      expect(decoded.userId).toBe(user._id.toString());
    });

    it('should reject invalid token', () => {
      expect(() => authService.validateToken('invalid')).toThrow();
    });
  });
});
