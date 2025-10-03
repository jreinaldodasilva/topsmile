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

      const result = await authService.login({ email: 'test@example.com', password: 'Password123!' });
      
      expect(result.data.accessToken).toBeDefined();
      expect(result.data.user.email).toBe('test@example.com');
    });

    it('should reject invalid password', async () => {
      await createTestUser(testClinic, {
        email: 'test@example.com',
        password: 'Password123!'
      });

      await expect(
        authService.login({ email: 'test@example.com', password: 'WrongPassword' })
      ).rejects.toThrow();
    });
  });

  describe('verifyAccessToken', () => {
    it('should validate valid token', async () => {
      const user = await createTestUser(testClinic);
      const result = await authService.login({ email: user.email, password: 'Password123!' });
      
      const decoded = authService.verifyAccessToken(result.data.accessToken);
      
      expect(decoded.userId).toBe(user._id.toString());
    });

    it('should reject invalid token', () => {
      expect(() => authService.verifyAccessToken('invalid')).toThrow();
    });
  });
});
